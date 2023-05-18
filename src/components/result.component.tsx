import { h, JSX } from 'preact';
import { Holiday } from '../types/booking';
import * as styles from './result.module.less';
import { useRouter } from 'preact-router';
import { useState, useEffect } from 'preact/hooks';

interface ResultProps {
    holiday: Holiday
}

function decodeHTMLEntities(encodedString: string) {
    const element = document.createElement('span');
    element.innerHTML = encodedString;
    return element.innerHTML;
}

export default function ResultComponent({ holiday }: ResultProps): JSX.Element {
    const [searchParams] = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loadedImages, setLoadedImages] = useState([]);
    const [showDetails, setShowDetails] = useState(false);

    const guests = searchParams?.matches?.adults as unknown as number;
    const images = holiday.hotel.content.images;
    const totalImages = images.length;

    const truncatedDesc = showDetails ?
        decodeHTMLEntities(holiday.hotel.content.hotelDescription) :
        `${decodeHTMLEntities(holiday.hotel.content.hotelDescription).slice(0, 150).trimEnd()}...`;

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

    const toggleExpansion = () => {
        setShowDetails(!showDetails);
    };

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
                    <header>
                        <h2>{holiday.hotel.name}</h2>
                    </header>
                    <p className={styles["location"]}>{holiday.hotel.content.parentLocation}</p>
                    <div>
                        <span>Rating: {holiday.hotel.content.vRating}</span>
                    </div>
                    <div className={styles["board-basis"]}><p>{holiday.hotel.boardBasis}</p></div>
                    <div className={styles["features"]}>
                        <ul>
                            {holiday.hotel.content.atAGlance.map((feature, index) => (
                                <li key={`${feature}-${index}`}><span dangerouslySetInnerHTML={{ __html: decodeHTMLEntities(feature) }}></span></li>
                            ))}
                        </ul>
                    </div>
                </div>
                {truncatedDesc !== "..." && <div className={styles["card-description"]}>
                    <span dangerouslySetInnerHTML={{ __html: truncatedDesc }}></span>
                    {!showDetails && <button onClick={toggleExpansion}>Read more</button>}
                </div>}
                <div className={styles["amenities"]}>
                    <div className={styles["amenities-title"]}>Amenities</div>
                    <ul>
                        {holiday.hotel.content.hotelFacilities.map((amenity, index) => (
                            <li key={`${amenity}-${index}`}>{amenity}</li>
                        ))}
                    </ul>
                </div>
                <div className={styles["card-price"]}>
                    <div className={styles["price"]}>
                        <p className={styles["price-value"]}>£{holiday.pricePerPerson}<span>pp</span></p>
                        <p className={styles["price-text"]}>Total for {guests} guests £{holiday.totalPrice}</p>
                        <p className={styles["price-points"]}>Earn from {holiday.virginPoints} extra Virgin Points and {holiday.tierPoints} Tier Points</p>
                    </div>
                </div>
            </div>
        </article>
    )
}