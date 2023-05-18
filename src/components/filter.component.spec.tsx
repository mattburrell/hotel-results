import { sortRatings, getPriceRanges } from "./filter.component";

describe('sortRatings function', () => {
    it('should sort ratings correctly', async () => {
        expect(sortRatings(["4", "5", "3", "5+", "3+", "4+"])).toEqual(["3", "3+", "4", "4+", "5", "5+"])
    })
    it('should sort ratings correctly', async () => {
        expect(sortRatings(['3+', 'NA', '5', '4+', '3', '4', '5+'])).toEqual(["3", "3+", "4", "4+", "5", "5+", "NA"])
    })
});

describe('getPriceRanges function', () => {
    const holidays = [
        { pricePerPerson: 500 },
        { pricePerPerson: 750 },
        { pricePerPerson: 1000 },
        { pricePerPerson: 1200 },
        { pricePerPerson: 900 },
    ];


    it('getPriceRanges returns correct price ranges', () => {
        const expected = [
            'up to £680',
            '£680 - £860',
            '£860 - £1040',
            'over £1040',
        ];

        //@ts-ignore
        const actual = getPriceRanges(holidays);
        expect(actual).toEqual(expected);
    });

    it('getPriceRanges returns empty array for empty input', () => {
        const expected = [];
        const actual = getPriceRanges([]);
        expect(actual).toEqual(expected);
    });
});