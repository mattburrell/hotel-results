import { h, JSX } from "preact";
import * as styles from './filter.module.less';
import { Holiday } from "../types/booking";
import CheckboxGroup from "./checkboxgroup.component";
import { useCallback } from "preact/hooks";

// ToDo: Move these functions into a utils file
export function sortRatings(array) {
    return array.sort((a, b) => {
        if (a === "NA" && b !== "NA") {
            return 1;
        } else if (a !== "NA" && b === "NA") {
            return -1;
        } else if (a === "NA" && b === "NA") {
            return 0;
        }

        const [numA, plusA] = a.split("+");
        const [numB, plusB] = b.split("+");

        const intA = parseInt(numA);
        const intB = parseInt(numB);

        if (intA !== intB) {
            return intA - intB;
        } else {
            if (plusA && !plusB) {
                return 1;
            } else if (!plusA && plusB) {
                return -1;
            } else {
                return a.length - b.length;
            }
        }
    });
}

function roundToNearestTen(value: number) {
    return Math.round(value / 10) * 10;
}

function getPriceRanges(holidays: Holiday[]) {
    const minPrice = Math.min(...holidays.map(holiday => holiday.pricePerPerson));
    const maxPrice = Math.max(...holidays.map(holiday => holiday.pricePerPerson));
    const priceRange = (maxPrice - minPrice) / 4;
    const priceRange1 = roundToNearestTen(minPrice + priceRange);
    const priceRange2 = roundToNearestTen(priceRange1 + priceRange);
    const priceRange3 = roundToNearestTen(priceRange2 + priceRange);
    return [`up to £${priceRange1}`, `£${priceRange1} - £${priceRange2}`, `£${priceRange2} - £${priceRange3}`, `over £${priceRange3}`]
}

interface FilterProps {
    holidays: Holiday[];
    filteredHolidays: Holiday[];
    setSelectedFacilities: (facilities: string[]) => void;
    setSelectedRatings: (ratings: string[]) => void;
    setSelectedPriceRange: (priceRange: string[]) => void;
}

export default function FilterComponent({
    holidays,
    filteredHolidays,
    setSelectedFacilities,
    setSelectedRatings,
    setSelectedPriceRange
}: FilterProps): JSX.Element {
    const uniqueFacilities = [...new Set(holidays.flatMap(holiday => holiday.hotel.content.hotelFacilities))];
    const uniqueRatings = sortRatings([...new Set(holidays.map(holiday => `${holiday.hotel.content.vRating}`))]);
    const priceRanges = holidays && holidays.length > 0 ? getPriceRanges(holidays) : [];

    return (
        <aside>
            <div id="filters" className={styles["filter-panel"]}>
                <header>
                    <h3>Filter by...</h3>
                </header>
                <div className={styles["filter-group"]}>
                    <h4>Price (PP)</h4>
                    <CheckboxGroup
                        options={priceRanges}
                        id="ppp"
                        filteredTotal={(opt) => 0} // ToDo: Implement this
                        updateResults={useCallback((selected) => setSelectedPriceRange(selected), [setSelectedPriceRange])}
                    />
                </div>
                <div className={styles["filter-group"]}>
                    <h4>Hotel Facilities</h4>
                    <CheckboxGroup
                        options={uniqueFacilities}
                        id="facility"
                        filteredTotal={(opt) => filteredHolidays.filter(h => h.hotel.content.hotelFacilities.includes(opt)).length}
                        updateResults={useCallback((selected) => setSelectedFacilities(selected), [setSelectedFacilities])}
                    />
                </div>
                <div className={styles["filter-group"]}>
                    <h4>Rating</h4>
                    <CheckboxGroup
                        options={uniqueRatings}
                        id="rating"
                        filteredTotal={(opt) => filteredHolidays.filter(h => h.hotel.content.vRating === opt).length}
                        updateResults={useCallback((selected) => setSelectedRatings(selected), [setSelectedRatings])}
                    />
                </div>
            </div>
        </aside>
    )
}