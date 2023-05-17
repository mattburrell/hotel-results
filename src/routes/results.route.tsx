import { h, JSX } from "preact";
import { useRouter } from "preact-router";
import { useEffect, useState } from "preact/hooks";
import SearchComponent from "../components/search.component";
import { doRequest } from "../services/http.service";
import { BookingRequest, BookingResponse, Holiday } from "../types/booking";
import { DateTime } from "luxon";
import ResultsComponent from "../components/results.component";

export default function ResultsRoute(): JSX.Element {
  const [searchParams] = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [holidays, setHolidays] = useState<Holiday[]>([])

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
        setHolidays(bookingResponse.holidays);
      }
    ).finally(() => {
      setIsLoading(false);
    });
  }, [searchParams]);

  return (
    <section>
      <SearchComponent />
      <ResultsComponent isLoading={isLoading} holidays={holidays} />
    </section>
  );
}
