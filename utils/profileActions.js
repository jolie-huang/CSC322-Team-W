import axios from "axios";
import Router from "next/router";
import cookie from "js-cookie";
import baseUrl from "./baseUrl";
import catchErrors from "./catchErrors";

// Instantiate axios
const Axios = axios.create({
  baseURL: `${baseUrl}/api/profile`,
  headers: { Authorization: cookie.get("token") },
});

// Have the active user follow a specified user
export const followUser = async (userToFollowId, setUserFollowStats) => {
  try {
    await Axios.post(`/follow/${userToFollowId}`);

    setUserFollowStats((prev) => ({
      ...prev,
      following: [...prev.following, { user: userToFollowId }],
    }));
  } catch (error) {
    alert(catchErrors(error));
  }
};

// Have active user unfollow a specified user
export const unfollowUser = async (userToUnfollowId, setUserFollowStats) => {
  try {
    await Axios.put(`/unfollow/${userToUnfollowId}`);

    setUserFollowStats((prev) => ({
      ...prev,
      following: prev.following.filter(
        (following) => following.user !== userToUnfollowId
      ),
    }));
  } catch (error) {
    alert(catchErrors(error));
  }
};

// Update the profile of active user with new inputs
export const profileUpdate = async (
  profile,
  setLoading,
  setError,
  profilePicUrl
) => {
  try {
    const { bio, facebook, instagram, twitter, linkedin, github, youtube } =
      profile;

    await Axios.post(`/update`, {
      bio,
      facebook,
      instagram,
      twitter,
      linkedin,
      github,
      youtube,
      profilePicUrl,
    });

    setLoading(false);
    Router.reload();
  } catch (error) {
    setError(catchErrors(error));
    setLoading(false);
  }
};

// Update the password of the active user
export const passwordUpdate = async (setSuccess, setError, userPasswords) => {
  const { currentPassword, newPassword } = userPasswords;
  try {
    await Axios.post(`/settings/password`, { currentPassword, newPassword });

    setSuccess(true);
  } catch (error) {
    setError(true);
  }
};

// Upon a new message, create the message poppup
export const toggleMessagePopup = async (
  popupSetting,
  setPopupSetting,
  setSuccess,
  setError
) => {
  try {
    await Axios.post(`/settings/messagePopup`);

    setPopupSetting(!popupSetting);
    setSuccess(true);
  } catch (error) {
    setError(true);
  }
};

// Have active user report a specified users profile
export const reportProfile = async (
  profile,
  user,
  text,
  setReports,
  setText,
  setError,
  setOpenReport
) => {
  try {
    const profileId = profile._id;
    const profileOwnerUserId = profile.user._id;

    const res = await Axios.post(`/report/${profileId}`, {
      text,
      profileOwnerUserId,
    });
    const newReport = {
      _id: res.data,
      user,
      text,
      date: Date.now(),
    };

    setReports((prev) => [newReport, ...prev]);
    setText("");
    setOpenReport(false);
  } catch (error) {
    const errorMsg = catchErrors(error);
    setError(errorMsg);
    setOpenReport(true);
  }
};
