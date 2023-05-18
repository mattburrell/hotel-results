import { h, JSX } from "preact";
import { useRouter } from "preact-router";
import { useEffect, useState } from "preact/hooks";
import SearchComponent from "../components/search.component";
import { doRequest } from "../services/http.service";
import { BookingRequest, BookingResponse, Holiday } from "../types/booking";
import { DateTime } from "luxon";
import ResultsComponent from "../components/results.component";
import FilterComponent from "../components/filter.component";
import * as styles from './results.module.less';

// ToDo: Write tests for this component

export default function ResultsRoute(): JSX.Element {
  const [searchParams] = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [holidays, setHolidays] = useState<Holiday[]>([])
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([])
  const [selectedRatings, setSelectedRatings] = useState<string[]>([])
  const [selectedPriceRange, setSelectedPriceRange] = useState<string[]>([])

  useEffect(() => {
    const departureDate = DateTime.fromFormat(
      searchParams?.matches?.departureDate || "",
      "yyyy-MM-dd"
    ).toFormat("dd-MM-yyyy");
    const requestBody: BookingRequest = {
      bookingType: "holiday",
      location: searchParams?.matches?.location || "",
      departureDate: departureDate,
      duration: searchParams?.matches?.duration as unknown as number,
      gateway: "LHR",
      partyCompositions: [
        {
          adults: searchParams?.matches?.adults as unknown as number,
          childAges: [],
          infants: 0,
        },
      ],
    };

    setIsLoading(true);
    doRequest("POST", "/cjs-search-api/search", requestBody).then(
      (response: unknown | BookingResponse) => {
        const bookingResponse = response as BookingResponse;
        bookingResponse && bookingResponse.holidays && setHolidays(bookingResponse.holidays);
      }
    ).finally(() => {
      setIsLoading(false);
    });
  }, [searchParams]);

  const getPriceRange = (priceRange: string) => {
    if (priceRange.startsWith('up to')) {
      const max = priceRange.replace(/[^0-9]/g, '');
      return [0, parseInt(max)]
    } else if (priceRange.startsWith('over')) {
      const min = priceRange.replace(/[^0-9]/g, '');
      return [parseInt(min), Number.MAX_VALUE]
    }
    const parts = priceRange.match(/\d+/g);
    const min = parts[0];
    const max = parts[1];
    return [parseInt(min), parseInt(max)];
  }

  const comparePriceRange = (holiday: Holiday, priceRange: string[]) => {
    for (let i = 0; i < priceRange.length; i++) {
      const [min, max] = getPriceRange(priceRange[i]);
      if (holiday.pricePerPerson >= min && holiday.pricePerPerson <= max) {
        return true
      }
    }
  }

  const filteredHolidays = holidays.filter(holiday => {
    if (selectedFacilities.length === 0 || selectedFacilities.every(facility => holiday.hotel.content.hotelFacilities.includes(facility))) {
      if (selectedRatings.length === 0 || selectedRatings.includes(`${holiday.hotel.content.vRating}`)) {
        if (selectedPriceRange.length === 0 || comparePriceRange(holiday, selectedPriceRange)) {
          return true;
        }
      }
    }
    return false;
  });

  return (
    <section>
      <SearchComponent />
      {isLoading ?
        <section className={styles["loading"]}>
          <h1>Searching for your perfect holiday...</h1>
        </section>
        :
        <section className={styles["main"]}>
          {holidays.length > 0 && <FilterComponent holidays={holidays}
            filteredHolidays={filteredHolidays}
            setSelectedFacilities={setSelectedFacilities}
            setSelectedRatings={setSelectedRatings}
            setSelectedPriceRange={setSelectedPriceRange}
          />}
          <ResultsComponent holidays={filteredHolidays} />
        </section>
      }
    </section>
  );
}
