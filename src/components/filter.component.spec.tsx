import { sortRatings } from "./filter.component";

describe('sortRatings function', () => {
    it('should sort ratings correctly', async () => {
        expect(sortRatings(["4", "5", "3", "5+", "3+", "4+"])).toEqual(["3", "3+", "4", "4+", "5", "5+"])
    })
    it('should sort ratings correctly', async () => {
        expect(sortRatings(['3+', 'NA', '5', '4+', '3', '4', '5+'])).toEqual(["3", "3+", "4", "4+", "5", "5+", "NA"])
    })
});