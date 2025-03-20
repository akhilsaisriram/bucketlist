import React from "react";
import Addbucketlist from "./Addbucketlist";
import Chatlayout from "./Chatlayout";
import Mapview from "./Mapview";
const Makegroup = () => {
  return (
    <div className=" mt-5">
      <div>
        <Addbucketlist></Addbucketlist>
      </div>
      <div className="mx-8 flex mt-4  h-[85vh]"><Chatlayout></Chatlayout></div>
      <div className=" flex mt-4  h-[100vh]"><Mapview></Mapview></div>

    </div>
  );
};

export default Makegroup;
