import React, { useEffect, useContext } from "react";
import io from "socket.io-client";
import { toast, Toaster } from "sonner";
import { StoreContext } from "../provider/contextProvider";
const socket = io("http://localhost:5000");

const SocketComponent = () => {
  const { setValue } = useContext(StoreContext);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const userId = user?.id;

  useEffect(() => {
    socket.on("page-refresh", (res) => {
      if (res.userId == userId) {
        console.log("userid   -" + userId);
        console.log("res userIOD  - " + res.userId);
        const message = res.message;
        toast.success(`New task added: ${message}. Please check.`);
        setValue({
          path: "refetch-dashboard-page",
          data: true,
        });
      }
    });

    return () => {
      socket.off("page-refresh");
    };
  }, [userId, setValue]);
  return <></>;
};

export default SocketComponent;
