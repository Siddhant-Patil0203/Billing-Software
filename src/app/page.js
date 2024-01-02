import { Button, Code, Divider } from "@nextui-org/react";

export default function Home() {
  return (
    <>
      <div className="m-3 text-3xl font-semibold text-center text-red-600">
        ASD Enterprises
      </div>
      <div className="m-3 text-center text-blue-600 font--medium text">
        T-Shirts, Cup, Key Chain, Water Bottle, Photo Frame, Birthday Gifts with
        Photo, Identity Cards Visiting Cards, Flex Banner, Glow Sign Board,
        Trophies and all types of Digital Printing Works available
      </div>
      <div className="flex flex-col justify-between md:flex-row">
        <Code className="m-3 text-center lg:p-4">GST No : 27AYPPD8713N1ZT</Code>
        <Code color="danger" className="m-3">
          <div className="flex flex-col items-center justify-center align-middle">
            <div>Ashwin Deogade</div>
            <div>(M) 8668527919 / 7249066711 </div>
          </div>
        </Code>
      </div>
      <Divider orientation="horizontal" />

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-1 grid-rows-12">
        <div className="col-span-12 p-5 bg-pink-600"></div>
        <div className="col-span-2 row-span-2 p-5 bg-purple-500"></div>
      </div>
    </>
  );
}
