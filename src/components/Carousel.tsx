import { Image, Text } from "@chakra-ui/react";
import { FC, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

type Props = {
  srcs: string[];
};

const Carousel: FC<Props> = ({ srcs }) => {
  const [slideIndex, setSlideIndex] = useState(0);

  return (
    <>
      <Text
        rounded="full"
        fontSize="xs"
        opacity="50%"
        bgColor="gray.800"
        m="2"
        p="1"
        zIndex="1"
        position="absolute"
      >{`${slideIndex + 1}/${srcs.length}`}</Text>
      <Slider
        speed={300}
        slidesToShow={1}
        slidesToScroll={1}
        swipeToSlide={true}
        focusOnSelect
        beforeChange={(_, next) => {
          setSlideIndex(next);
        }}
      >
        {srcs.map((src, index) => {
          return (
            <Image
              src={src}
              maxH="md"
              alt={`image-${index}`}
              objectFit="contain"
              onClick={() => {
                if (index === slideIndex) window.open(src, "_blank");
              }}
              key={index}
            />
          );
        })}
      </Slider>
    </>
  );
};

export default Carousel;
