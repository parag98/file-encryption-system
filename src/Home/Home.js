import axios from "../axios";
import React, { useEffect, useState } from "react";
import { Route, Link } from "react-router-dom";
import Upload from "./Upload";
import { appendImages } from "../utils/imageDec";

const Home = () => {
  document.body.style = "background: #1DA1F2;";
  const [privateKey, setprivateKey] = useState("");
  const [user, setuser] = useState({});
  const [images, setimages] = useState([]);
  const [pageNum, setpageNum] = useState(1);
  const numPerPage = 5;

  const logout = () => {
    window.localStorage.removeItem("privateKey");
    window.localStorage.removeItem("user");
    window.location.assign("/login");
  };

  const getImages = async (userId, pageNumber, numEachPage) => {
    if (!userId) return;
    try {
      let data = await axios.get(
        `uploads/all_media/${userId}/${pageNumber}/${numEachPage}`
      );
      data = await data.data;
      console.log(data);
      if (data.status == 1) {
        if (data.data.length == 0 && pageNumber != 0) {
          setpageNum(pageNumber - 1);
          alert("No more data found.");
          return;
        }
        setimages(data.data);
      } else alert(data.msg);
    } catch (error) {
      alert(error);
    }
  };

  //download image
  // 
  
  
  useEffect(() => {
    const pk = window.localStorage.getItem("privateKey");
    const u = window.localStorage.getItem("user");


    if (!pk || !u) {
      alert("Login first.");
      window.location.assign("/login");
    }
    setprivateKey(pk);
    setuser(JSON.parse(u));
  }, []);
  useEffect(() => {
    getImages(user?._id, pageNum, numPerPage);
  }, [user?._id, pageNum, numPerPage]);

  useEffect(() => {
    appendImages(images, privateKey);
  }, [images.length]);

  const imgUrl = window.localStorage.getItem("imgUrl");
  console.log(imgUrl)
  return (
    <>
      <div className="">
        <div className="w-50 container d-flex flex-column bd-highlight mb-3 mt-5 shadow-lg p-0 mb-5 bg-light  border-round2 ">
          <div className="d-flex justify-content-between p-0 bd-highlight border-round1  bg-success mt-0 mb-0 ml-0 mr-0 px-5 ">
            <h2 className=" mt-4 mb-4">Greetings! {user?.username}</h2>
            <div>
              <button onClick={logout} className="mt-3 mb-3 btn btn-warning ">
                <h4>Logout</h4>
              </button>
            </div>
          </div>
          
          <div className="p-0 bd-highlight  bg-light  ">
            <center><h4 className="card-title mt-0 p-3">Here are your uploaded photos</h4></center>
            <div className=" d-flex justify-content-between flex-column  ">  

            <center>          
            <div 
            id="allMedia" 
            className="w-100"
            >   
            </div>   
            </center>
            </div>
           

            <div className="d-flex  justify-content-center ">
              {pageNum != 1 ? (
                <>
                  <button
                    className=" btn btn-danger"
                    onClick={() => {
                      setpageNum((pre) => pre - 1);
                    }}
                  >
                    Previous
                  </button>
                </>
              ) : null}

              {images.length == 5 ? (
                <>
                  <button
                    className="btn btn-danger "
                    style={{ marginLeft: "20px" }}
                    onClick={() => {
                      setpageNum((pre) => pre + 1);
                    }}
                  >
                    Next
                  </button>
                </>
              ) : null}
            </div>
          </div>
          <Upload />
        </div>
        
      </div>
      
    </>
  );
};

export default Home;
