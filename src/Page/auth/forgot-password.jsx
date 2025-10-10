import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { post } from "../../feature/api";

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);
  const leafUserid = localStorage.getItem("leafUserid");


  
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    try {
      const data = { documentId: leafUserid, password: password };
      await post("/auth/update-password", data);
      toast.success("Password reset successfully!");
      sessionStorage.removeItem("resetEmail");
      navigate("/sign-in");
    } catch (error) {
      toast.error("Failed to reset password. Please try again.");
    }
  };


  useEffect(() => {
    if (!leafUserid) return (window.location.href = "/sign-in");
  }, []);

  return (
    <div className="flex flex-col items-center py-6">
      <div className="rounded-xl shadow-2xl sm:w-[440px] w-[320px] px-4 py-6">
        <h2 className="text-2xl mb-6 text-center text-black font-semibold">
          Set New Password
        </h2>
        <form onSubmit={handleResetPassword}>
          <TextField
            label="New Password"
            variant="filled"
            type="password"
            className="w-full border p-2 rounded-md"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="w-full flex justify-between items-center  rounded-md outline-[var(--color-secondry)]">
            <TextField
              label="Confirm Password"
              variant="filled"
              className="w-full border  mt-1 border-white"
              name="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type={passwordShown ? "text" : "password"}
            />
            {passwordShown ? (
              <RemoveRedEyeIcon onClick={() => setPasswordShown(false)} />
            ) : (
              <VisibilityOffIcon onClick={() => setPasswordShown(true)} />
            )}
          </div>
          <button
            type="submit"
            className="bg-[var(--color-primary)] cursor-pointer w-full mt-6 py-2 rounded-xl text-white"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};
