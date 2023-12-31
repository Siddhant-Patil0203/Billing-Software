"use client";

import {
  Button,
  Code,
  Divider,
  Select,
  SelectItem,
  Input,
  Card,
  CardBody,
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
        <div className="col-span-3 p-1 text-sm text-left border-slate-400 border-1">
          <Input
            isReadOnly
            type="text"
            label="No.:"
            variant="flat"
            labelPlacement="outside-left"
            defaultValue="ASDE/2024/100"
          />
        </div>
        <div className="col-span-3 p-1 text-sm text-left border-slate-400 border-1">
          <Input
            isReadOnly
            type="text"
            label="Date:"
            variant="flat"
            labelPlacement="outside-left"
            defaultValue="08/01/2024"
          />
        </div>
        <div className="col-span-3 p-1 text-sm text-left border-slate-400 border-1">
          <Input
            isReadOnly
            type="text"
            label="GSTIN:"
            variant="flat"
            labelPlacement="outside-left"
            defaultValue="27AYPPD8713N1ZT"
          />
        </div>
        <div className="col-span-3 p-1 text-sm text-left border-slate-400 border-1">
          <Input
            isReadOnly
            type="text"
            label="STATE:"
            variant="flat"
            labelPlacement="outside-left"
            defaultValue="MAHARASHTRA"
          />
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
        <div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div>
        <div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div><div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div><div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div><div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div><div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div><div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div>

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
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div>
        <div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div><div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div><div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div><div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div><div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div><div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div><div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div>

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
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div>
        <div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div><div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div><div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div><div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div><div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div><div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div><div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div>

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
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div>
        <div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div><div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div><div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div><div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div><div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div><div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div><div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div>

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
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div>
        <div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div><div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div><div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div><div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div><div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div><div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div><div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div>

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
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div>
        <div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div><div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div><div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div><div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div><div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div><div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div><div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div>

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
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div>
        <div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div><div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div><div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div><div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div><div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div><div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div><div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div>

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
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div>
        <div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div><div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div><div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div><div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div><div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div><div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div><div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div>

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
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div>
        <div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div><div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div><div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div><div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div><div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div><div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div><div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div>

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
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div>
        <div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div><div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div><div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div><div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div><div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div><div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div><div className="col-span-1 p-1 text-center text-md border-slate-400 border-1">
          <Input
            type="text"
            placeholder=""
            variant="underlinded"
            labelPlacement="outside-left"
          />
        </div>

        {/* Total */}
        <div className="col-span-6 pr-4 font-semibold text-right text-md border-slate-400 border-1">
          Total :
        </div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
        <div className="col-span-1 p-2 text-2xl text-center border-slate-400 border-1"></div>
      </div>

      {/* Declaration & Total Sum */}
      <div className="grid grid-cols-12 gap-0 grid-rows-12">
        <div className="col-span-6 row-span-3 pt-1 pl-2 text-sm font-semibold text-left border-slate-400 border-1">
          50% Advance with Work Order / PO <br />
          50% After Completion of Work
        </div>
        <div className="col-span-5 p-0 text-sm font-semibold text-center border-slate-400 border-1">
          GST AMOUNT
        </div>
        <div className="col-span-1 p-0 text-sm text-right border-slate-400 border-1"></div>
        <div className="col-span-5 p-0 text-sm font-semibold text-center border-slate-400 border-1">
          Total Amount
        </div>
        <div className="col-span-1 p-0 text-sm text-right border-slate-400 border-1"></div>
        <div className="col-span-6 p-0 text-sm text-center border-slate-400 border-1">
          Certifies that the perticulars given above are true and correct
        </div>

        <div className="flex justify-between col-span-12 row-span-3 px-2 py-1 text-sm border-slate-400 border-1">
          <div>
            Without GSTIN :{" "}
            <span className="font-semibold">
              Five Thousand One Hundred Nine Only
            </span>{" "}
            <br />
            GSTIN :{" "}
            <span className="font-semibold">
              NineHundred Nineteen and Sixty Two Paise Only
            </span>{" "}
            <br />
            Total :{" "}
            <span className="font-semibold">
              Six Thousand Twenty Six and Sixty Two Paise Only
            </span>
          </div>
          <div className="flex flex-col justify-between pr-6 text-center">
            <div>For ASD ENTERPRISES </div>
            <div>Proprietor</div>
          </div>
        </div>

        {/* Address */}
        <div className="col-span-12 row-span-2 p-1 text-sm text-center border-slate-400 border-1">
          Plot No. 91, Shilpa Society, Narendra Nagar, Manish Nagar Road, Beside
          NIT Garden, Nagpur - 440015 <br />
          Email : asdenterprisesnagpur@gmall.com
        </div>
      </div>
    </>
  );
}
