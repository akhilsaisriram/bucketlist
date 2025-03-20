// ExploreLayout.js
import React from "react";
import { Modal, List, Button } from "antd";
import Diaplayimgvid from "../helper/Diaplayimgvid";
import Auto_comp from "../../maps/Auto_comp";

const ExploreLayout = ({
  user,
  followersCount,
  followingCount,
  postsCount,
  location,
  isEditingLocation,
  setIsEditingLocation,
  handleFollowersClick,
  handleFollowingClick,
  handleDialogClose,
  handleLocationSelect,
  followers,
  following,
  isFollowerDialogOpen,
  isFollowingDialogOpen,
  post,
}) => {
  return (
    <div className="flex flex-col">
      <div className="w-full h-auto p-4">
        <div className="flex flex-col md:flex-row justify-center items-center text-center mt-4">
          {/* Profile Image */}
          <div className="flex w-full md:w-[20%] justify-center mb-4 md:mb-0">
            <img
              src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
              alt="Profile"
              className="w-32 h-32 md:w-40 md:h-40 rounded-full"
            />
          </div>

          {/* User Details */}
          <div className="flex w-full md:w-[60%] bg-slate-100 p-4 rounded-lg shadow-lg text-left">
            <div className="w-full text-center md:text-left">
              <h2 className="text-2xl font-bold mb-2 text-gray-800">
                {user.username}
              </h2>
              <p className="text-gray-600">
                <strong>Email:</strong> {user.email}
              </p>
              <p className="text-gray-600">
                <strong>Phone:</strong> {user.phone}
              </p>
              <p className="text-gray-600">
                <strong>Date of Birth:</strong> {user.dob}
              </p>
              <p className="text-gray-600 flex items-center">
                <strong>Location:</strong>
                <span className="ml-2">{location}</span>

                {isEditingLocation ?  (
                  
                  <Auto_comp
                    onSelect={(selected, loc) =>
                      handleLocationSelect(selected, loc)
                    }
                  />
                ) : (
                  <>
                    {handleLocationSelect && (
                      <>
                        {" "}
                        <button
                          onClick={() => setIsEditingLocation(true)}
                          className="ml-4 text-blue-500 hover:underline"
                        >
                          Edit
                        </button>
                      </>
                    )}
                  </>
                )}
              </p>
             {!handleLocationSelect && <><Button>Follow</Button></>}
             {/* Friends Info */}
              <div className="mt-4 flex justify-around md:justify-between md:gap-6">
                <div
                  className="text-gray-700"
                  onClick={handleFollowersClick}
                  style={{ cursor: "pointer" }}
                >
                  <p className="text-xl font-semibold">{followersCount}</p>
                  <p className="text-gray-500">Followers</p>
                </div>
                <div
                  className="text-gray-700"
                  onClick={handleFollowingClick}
                  style={{ cursor: "pointer" }}
                >
                  <p className="text-xl font-semibold">{followingCount}</p>
                  <p className="text-gray-500">Following</p>
                </div>
                <div className="text-gray-700">
                  <p className="text-xl font-semibold">{postsCount}</p>
                  <p className="text-gray-500">Posts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Follower Dialog */}
      <Modal
        title="Followers"
        visible={isFollowerDialogOpen}
        onCancel={handleDialogClose}
        footer={null}
      >
        <List
          dataSource={followers}
          renderItem={(follower, index) => (
            <List.Item key={index}>
              <p>{follower.name}</p>
            </List.Item>
          )}
        />
      </Modal>

      {/* Following Dialog */}
      <Modal
        title="Following"
        visible={isFollowingDialogOpen}
        onCancel={handleDialogClose}
        footer={null}
      >
        <List
          dataSource={following}
          renderItem={(followedUser, index) => (
            <List.Item key={index}>
              <p>{followedUser.name}</p>
            </List.Item>
          )}
        />
      </Modal>

      {/* Additional Content */}
      <div className="w-full mt-4">
        <hr style={{ borderColor: "black" }} />
        <Diaplayimgvid posts={post} />
      </div>
    </div>
  );
};

export default ExploreLayout;
