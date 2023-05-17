import { h, JSX } from 'preact';
import { Holiday } from '../types/booking';
import * as styles from './result.module.less';
import { useRouter } from 'preact-router';
import { useState, useEffect } from 'preact/hooks';

interface ResultProps {
    holiday: Holiday
}

export default function ResultComponent({ holiday }: ResultProps): JSX.Element {
    const [searchParams] = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loadedImages, setLoadedImages] = useState([]);

    const guests = searchParams?.matches?.adults as unknown as number;
    const images = holiday.hotel.content.images;
    const totalImages = images.length;

    useEffect(() => {
        const loadImage = (index: number) => {
            const image = new Image();
            image.onload = () => {
                setLoadedImages((prevImages) => {
                    const newImages = [...prevImages];
                    newImages[index] = true;
                    return newImages;
                });
            };
            image.src = images[index].RESULTS_CAROUSEL.url;
        };

        if (!loadedImages[currentIndex]) {
            loadImage(currentIndex);
        }
    }, [currentIndex, images, loadedImages]);

    const handlePrevImage = () => {
        const prevIndex = (currentIndex === 0) ? totalImages - 1 : currentIndex - 1;
        setCurrentIndex(prevIndex);
    }

    const handleNextImage = () => {
        const nextIndex = (currentIndex === totalImages - 1) ? 0 : currentIndex + 1;
        setCurrentIndex(nextIndex);
    }

    return (
        <article className={styles["card"]}>
            <div className={styles["card-image"]}>
                <div className={styles["carousel"]}>
                    {images.map((image, index) => (
                        <img key={`${holiday.hotel.id}-${index}`}
                            src={loadedImages[index] ? image.RESULTS_CAROUSEL.url : ''}
                            alt={image.IMAGE_DESCRIPTION || holiday.hotel.name}
                            className={index === currentIndex ? styles["active"] : ""}
                        />
                    ))}
                    <div className={styles["carousel-nav"]}>
                        <button id={`prevBtn-${holiday.hotel.id}`} onClick={handlePrevImage}>{"<"}</button>
                        <span>{currentIndex + 1} of {totalImages}</span>
                        <button id={`nextBtn-${holiday.hotel.id}`} onClick={handleNextImage}>{">"}</button>
                    </div>
                </div>
            </div>
            <div className={styles["card-content"]}>
                <div className={styles["card-details"]}>
                    <div>{holiday.hotel.name}</div>
                    <div className={styles["location"]}>{holiday.hotel.content.parentLocation}</div>
                    <div className={styles["rating"]}>

                    </div>
                    <div className={styles["board-basis"]}>{holiday.hotel.content.boardBasis}</div>
                    <div className={styles["features"]}>
                        <ul>
                            {holiday.hotel.content.atAGlance.map((feature, index) => (
                                <li key={`${feature}-${index}`}>{feature}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className={styles["card-price"]}>
                    <div className={styles["price"]}>
                        <div className={styles["price-value"]}>£{holiday.pricePerPerson}pp</div>
                        <div className={styles["price-text"]}>Total for {guests} guests £{holiday.totalPrice}</div>
                    </div>
                </div>
            </div>
            <div className={styles["card-drawers"]}></div>
        </article>
    )
}