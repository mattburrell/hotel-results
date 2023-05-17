import { h, JSX } from 'preact';
import { Holiday } from '../types/booking';
import ResultComponent from './result.component';
import * as styles from './results.module.less';
import { Link } from 'preact-router';

interface ResultsProps {
    isLoading: boolean
    holidays: Holiday[]
}

export default function ResultsComponent({ isLoading, holidays }: ResultsProps): JSX.Element {
    if (isLoading) {
        return (
            <section className={styles['results-wrapper']}>
                <h1>Searching for your perfect holiday...</h1>
            </section>
        )
    }

    if (!holidays || holidays.length === 0) {
        return (
            <section className={styles['results-wrapper']}>
                <h1>There&apos;s no availability on that date.</h1>
                <p>Please search again or try one of these options:</p>
                <Link href="/">
                    Return to homepage
                </Link>
            </section>
        )
    }

    return (
        <section className={styles['results-wrapper']}>
            <h1><span>{`${holidays.length}`}</span> holidays found</h1>
            <section className={styles["stacked-results"]}>
                {holidays.map((holiday, index) => (
                    <ResultComponent key={`${holiday.hotel.id}-${index}`} holiday={holiday} />
                ))}
            </section>
        </section>
    )
}