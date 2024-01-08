"use client";

import {
  Button,
  Code,
  Divider,
  Select,
  SelectItem,
  Input,
} from "@nextui-org/react";

import { SelectorIcon } from "./SelectorIcon";

const products = [
  { value: "T-Shirt" },
  { value: "Cup" },
  { value: "Key Chain" },
  { value: "Water Bottle" },
  { value: "Photo Frame" },
  { value: "Birthday Gifts with Photo" },
];

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
      <div className="grid grid-cols-12 gap-0 mt-2 grid-rows-12">
        {/* Heading/Title */}
        <div className="col-span-12 p-2 text-xl font-bold text-center border-slate-400 border-1">
          QUOTATION
        </div>

        {/* Bill Details */}
        <div className="col-span-3 p-3 text-left border-slate-400 text-md border-1">
          NO.: ASDE/2024/100
        </div>
        <div className="col-span-3 p-3 text-left border-slate-400 text-md border-1">
          DATE: 08/01/2024
        </div>
        <div className="col-span-3 p-3 text-left border-slate-400 text-md border-1">
          GSTIN: 27AYPPD8713N1ZT
        </div>
        <div className="col-span-3 p-3 text-left border-slate-400 text-md border-1">
          STATE: MAHARASHTRA
        </div>

        {/* Deatils of Reciever */}
        {/* <div className="col-span-12 p-3 text-sm font-semibold text-center border-slate-400 border-1">
          BILL DETAILS
        </div> */}
        <div className="col-span-4 p-1 text-left border-slate-400 border-1 text-md">
          {/* NAME: */}
          <Input
            type="name"
            label="Name: "
            variant="flat"
            labelPlacement="outside-left"
          />
        </div>
        <div className="col-span-4 p-1 text-left border-slate-400 border-1 text-md">
          <Input
            type="address"
            label="Address: "
            variant="flat"
            labelPlacement="outside-left"
          />
        </div>
        <div className="col-span-4 p-1 text-left border-slate-400 border-1 text-md">
          <Input
            type="state"
            label="State: "
            variant="flat"
            labelPlacement="outside-left"
          />
        </div>

        {/* <Divider className="w-full "/> */}
        {/* Title of Items */}
        <div className="col-span-1 p-2 text-center text-md border-slate-400 border-1">
          Sr. No.
        </div>
        <div className="col-span-3 p-2 text-center text-md border-slate-400 border-1">
          Name of Product
        </div>
        <div className="col-span-1 p-2 text-center text-md border-slate-400 border-1">
          Qty.
        </div>
        <div className="col-span-1 p-2 text-center text-md border-slate-400 border-1">
          Rate
        </div>
        <div className="col-span-1 p-2 text-center text-md border-slate-400 border-1">
          Amt.
        </div>
        <div className="col-span-2 p-0 text-center text-md border-slate-400 border-1 ">
          <div className="grid grid-rows-2 gap-0 grid-row-sub-2">
            <div className="col-span-2 p-[1px] text-sm text-center border-slate-400 border-b-1">
              CGST
            </div>
            <div className="col-span-1 p-0 text-sm text-center border-slate-400 border-r-1">
              Rate
            </div>
            <div className="col-span-1 p-0 text-sm text-center border-0 border-slate-400">
              Amt
            </div>
          </div>
        </div>
        <div className="col-span-2 p-0 text-2xl text-center border-slate-400 border-1 ">
          <div className="grid grid-rows-2 gap-0 grid-row-sub-2">
            <div className="col-span-2 p-[1px] text-sm text-center border-slate-400 border-b-1">
              SGST
            </div>
            <div className="col-span-1 p-0 text-sm text-center border-slate-400 border-r-1">
              Rate
            </div>
            <div className="col-span-1 p-0 text-sm text-center border-0 border-slate-400">
              Amt.
            </div>
          </div>
        </div>
        <div className="col-span-1 p-3 text-center text-md border-slate-400 border-1">
          Total
        </div>

        {/* Items 1*/}
        <div className="col-span-1 p-3 text-sm text-center border-slate-400 border-1">
          01.
        </div>
        <div className="col-span-3 p-1 text-2xl text-center border-slate-400 border-1">
          <Select
            isRequired
            label=""
            placeholder="Select an Product"
            labelPlacement="outside"
            className="max-w-xm"
            selectorIcon={<SelectorIcon />}
          >
            {products.map((prd) => (
              <SelectItem key={prd.value} value={prd.value}>
                {prd.value}
              </SelectItem>
            ))}
          </Select>
        </div>
        <div className="col-span-1 p-1 text-2xl text-center border-slate-400 border-1">
          <Input
            type="number"
            placeholder="00"
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>

        {/* Items 2*/}
        <div className="col-span-1 p-3 text-sm text-center border-slate-400 border-1">
          02.
        </div>
        <div className="col-span-3 p-1 text-2xl text-center border-slate-400 border-1">
          <Select
            label=""
            placeholder=""
            labelPlacement="outside"
            className="max-w-xm"
            selectorIcon={<SelectorIcon />}
          >
            {products.map((prd) => (
              <SelectItem key={prd.value} value={prd.value}>
                {prd.value}
              </SelectItem>
            ))}
          </Select>
        </div>
        <div className="col-span-1 p-1 text-2xl text-center border-slate-400 border-1">
          <Input
            type="number"
            placeholder="00"
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>

        {/* Items 3*/}
        <div className="col-span-1 p-3 text-sm text-center border-slate-400 border-1">
          03.
        </div>
        <div className="col-span-3 p-1 text-2xl text-center border-slate-400 border-1">
          <Select
            label=""
            placeholder=""
            labelPlacement="outside"
            className="max-w-xm"
            selectorIcon={<SelectorIcon />}
          >
            {products.map((prd) => (
              <SelectItem key={prd.value} value={prd.value}>
                {prd.value}
              </SelectItem>
            ))}
          </Select>
        </div>
        <div className="col-span-1 p-1 text-2xl text-center border-slate-400 border-1">
          <Input
            type="number"
            placeholder="00"
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>

        {/* Items 4*/}
        <div className="col-span-1 p-3 text-sm text-center border-slate-400 border-1">
          04.
        </div>
        <div className="col-span-3 p-1 text-2xl text-center border-slate-400 border-1">
          <Select
            label=""
            placeholder=""
            labelPlacement="outside"
            className="max-w-xm"
            selectorIcon={<SelectorIcon />}
          >
            {products.map((prd) => (
              <SelectItem key={prd.value} value={prd.value}>
                {prd.value}
              </SelectItem>
            ))}
          </Select>
        </div>
        <div className="col-span-1 p-1 text-2xl text-center border-slate-400 border-1">
          <Input
            type="number"
            placeholder="00"
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>

        {/* Items 5*/}
        <div className="col-span-1 p-3 text-sm text-center border-slate-400 border-1">
          05.
        </div>
        <div className="col-span-3 p-1 text-2xl text-center border-slate-400 border-1">
          <Select
            label=""
            placeholder=""
            labelPlacement="outside"
            className="max-w-xm"
            selectorIcon={<SelectorIcon />}
          >
            {products.map((prd) => (
              <SelectItem key={prd.value} value={prd.value}>
                {prd.value}
              </SelectItem>
            ))}
          </Select>
        </div>
        <div className="col-span-1 p-1 text-2xl text-center border-slate-400 border-1">
          <Input
            type="number"
            placeholder="00"
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>

        {/* Items 6*/}
        <div className="col-span-1 p-3 text-sm text-center border-slate-400 border-1">
          06.
        </div>
        <div className="col-span-3 p-1 text-2xl text-center border-slate-400 border-1">
          <Select
            label=""
            placeholder=""
            labelPlacement="outside"
            className="max-w-xm"
            selectorIcon={<SelectorIcon />}
          >
            {products.map((prd) => (
              <SelectItem key={prd.value} value={prd.value}>
                {prd.value}
              </SelectItem>
            ))}
          </Select>
        </div>
        <div className="col-span-1 p-1 text-2xl text-center border-slate-400 border-1">
          <Input
            type="number"
            placeholder="00"
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>

        {/* Items 7*/}
        <div className="col-span-1 p-3 text-sm text-center border-slate-400 border-1">
          07.
        </div>
        <div className="col-span-3 p-1 text-2xl text-center border-slate-400 border-1">
          <Select
            label=""
            placeholder=""
            labelPlacement="outside"
            className="max-w-xm"
            selectorIcon={<SelectorIcon />}
          >
            {products.map((prd) => (
              <SelectItem key={prd.value} value={prd.value}>
                {prd.value}
              </SelectItem>
            ))}
          </Select>
        </div>
        <div className="col-span-1 p-1 text-2xl text-center border-slate-400 border-1">
          <Input
            type="number"
            placeholder="00"
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>

        {/* Items 8*/}
        <div className="col-span-1 p-3 text-sm text-center border-slate-400 border-1">
          08.
        </div>
        <div className="col-span-3 p-1 text-2xl text-center border-slate-400 border-1">
          <Select
            label=""
            placeholder=""
            labelPlacement="outside"
            className="max-w-xm"
            selectorIcon={<SelectorIcon />}
          >
            {products.map((prd) => (
              <SelectItem key={prd.value} value={prd.value}>
                {prd.value}
              </SelectItem>
            ))}
          </Select>
        </div>
        <div className="col-span-1 p-1 text-2xl text-center border-slate-400 border-1">
          <Input
            type="number"
            placeholder="00"
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>

        {/* Items 9*/}
        <div className="col-span-1 p-3 text-sm text-center border-slate-400 border-1">
          09.
        </div>
        <div className="col-span-3 p-1 text-2xl text-center border-slate-400 border-1">
          <Select
            label=""
            placeholder=""
            labelPlacement="outside"
            className="max-w-xm"
            selectorIcon={<SelectorIcon />}
          >
            {products.map((prd) => (
              <SelectItem key={prd.value} value={prd.value}>
                {prd.value}
              </SelectItem>
            ))}
          </Select>
        </div>
        <div className="col-span-1 p-1 text-2xl text-center border-slate-400 border-1">
          <Input
            type="number"
            placeholder="00"
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>

        {/* Items 10*/}
        <div className="col-span-1 p-3 text-sm text-center border-slate-400 border-1">
          10.
        </div>
        <div className="col-span-3 p-1 text-2xl text-center border-slate-400 border-1">
          <Select
            label=""
            placeholder=""
            labelPlacement="outside"
            className="max-w-xm"
            selectorIcon={<SelectorIcon />}
          >
            {products.map((prd) => (
              <SelectItem key={prd.value} value={prd.value}>
                {prd.value}
              </SelectItem>
            ))}
          </Select>
        </div>
        <div className="col-span-1 p-1 text-2xl text-center border-slate-400 border-1">
          <Input
            type="number"
            placeholder="00"
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>

        {/* Total */}
        <div className="col-span-6 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
      </div>

      {/* Declaration & Total Sum */}
      <div className="grid grid-cols-12 gap-0 grid-rows-12">
        <div className="col-span-6 row-span-3 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-5 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-5 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-6 p-2 text-2xl text-center border-slate-400 border-1"></div>

        <div className="col-span-12 row-span-3 p-2 text-2xl text-center border-slate-400 border-1"></div>

        {/* Address */}
        <div className="col-span-12 row-span-2 p-2 text-2xl text-center border-slate-400 border-1"></div>
      </div>
    </>
  );
}
