import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const storeLeafUser = (data) => {
  localStorage.setItem(
    "leafUser",
    JSON.stringify({
      id: data?.user?.documentId,
      access_leaf: data?.token,
    })
  );
};

export const fetchUserData = () => {
  const stringifiedUser = localStorage.getItem("leafUser");
  if (!stringifiedUser || stringifiedUser === 'undefined' || stringifiedUser === 'null') {
    return {};
  }
  try {
    return JSON.parse(stringifiedUser);
  } catch (error) {
    return {};
  }
};

export const Protector = ({ Component }) => {
  const navigate = useNavigate();
  const { access_leaf } = fetchUserData();
  useEffect(() => {
    if (!access_leaf) {
      navigate("/sign-in");
    }
  }, [navigate, access_leaf]);
};
