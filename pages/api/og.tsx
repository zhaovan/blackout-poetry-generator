import { ImageResponse } from "@vercel/og";

import img from "../../public/og-img.png";

export const config = {
  runtime: "experimental-edge",
};

const text = [
  "dasjhkfkdsahfa dsff adsf adsfdasfa ds",
  "fasdfdsafasdfa afsd dsas asd",
  "ads adas adsd dsaa aaa",
  "adsasdadsa asd asd adsd ad adsaa",
];

export default function () {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 64,
          background: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          textAlign: "center",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        Blackout Poetry Generator
        <img src="/og-img.png" alt="" />
      </div>
    ),
    {
      width: 1200,
      height: 600,
    }
  );
}
