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
        {/* Heading/Title */}
        <div className="col-span-12 p-5 bg-pink-600"></div>

        {/* Bill Details */}
        <div className="col-span-3 p-5 bg-purple-500"></div>
        <div className="col-span-3 p-5 bg-purple-500"></div>
        <div className="col-span-3 p-5 bg-purple-500"></div>
        <div className="col-span-3 p-5 bg-purple-500"></div>

        {/* Deatils of Reciever */}
        <div className="col-span-4 p-5 bg-pink-400"></div>
        <div className="col-span-4 p-5 bg-pink-400"></div>
        <div className="col-span-4 p-5 bg-pink-400"></div>

        {/* <Divider className="w-full "/> */}

        {/* Title of Items */}
        <div className="col-span-1 p-5 bg-teal-300"></div>
        <div className="col-span-3 p-5 bg-teal-300"></div>
        <div className="col-span-1 p-5 bg-teal-300"></div>
        <div className="col-span-1 p-5 bg-teal-300"></div>
        <div className="col-span-1 p-5 bg-teal-300"></div>
        <div className="col-span-2 p-1 bg-teal-300 ">
          <div className="grid grid-rows-2 gap-1 grid-row-sub-2">
            <div className="col-span-2 p-2 bg-teal-100"></div>
            <div className="col-span-1 p-2 bg-teal-100"></div>
            <div className="col-span-1 p-2 bg-teal-100"></div>
          </div>
        </div>
        <div className="col-span-2 p-1 bg-teal-300">
        <div className="grid grid-rows-2 gap-1 grid-row-sub-2">
            <div className="col-span-2 p-2 bg-teal-100"></div>
            <div className="col-span-1 p-2 bg-teal-100"></div>
            <div className="col-span-1 p-2 bg-teal-100"></div>
          </div>
        </div>
        <div className="col-span-1 p-5 bg-teal-300"></div>

        {/* Items 1*/}
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-3 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>  

        {/* Items 2*/}
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-3 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>  

        {/* Items 3*/}
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-3 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>  

        {/* Items 4*/}
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-3 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>  

        {/* Items 5*/}
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-3 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>  

        {/* Items 6*/}
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-3 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>  

        {/* Items 7*/}
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-3 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>  
        
        {/* Items 8*/}
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-3 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>  

        {/* Items 9*/}
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-3 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>

        {/* Items 10*/}
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-3 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>
        <div className="col-span-1 p-5 bg-yellow-300"></div>   
      </div>
    </>
  );
}
