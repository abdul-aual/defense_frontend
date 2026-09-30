// // import {
// //   useLocation,
// //   useNavigate,
// // } from "react-router-dom";
// // import { useState } from "react";
// // import PasswordInput from "../pages/admin/AdminDashboard/components/PasswordInput";
// // import "./Login.css";

// // interface LoginLocationState {
// //   returnTo?: string;

// //   bookingState?: {
// //     vehicle?: unknown;
// //     searchCriteria?: unknown;
// //     pickupPoint?: string;
// //   };
// // }

// // function Login() {
// //   const navigate = useNavigate();
// //   const location = useLocation();

// //   /*
// //    * Check whether the customer came here from
// //    * the booking page.
// //    */
// //   const loginState =
// //     location.state as LoginLocationState | null;

// //   const [formData, setFormData] = useState({
// //     phone: "",
// //     password: "",
// //   });

// //   const [errors, setErrors] = useState<
// //     Record<string, string>
// //   >({});

// //   const [serverError, setServerError] =
// //     useState("");

// //   const [isSubmitting, setIsSubmitting] =
// //     useState(false);

// //   /* =========================================================
// //      HANDLE INPUT CHANGE
// //   ========================================================= */

// //   const handleChange = (
// //     e: React.ChangeEvent<HTMLInputElement>
// //   ) => {
// //     const { name, value } = e.target;

// //     setFormData({
// //       ...formData,
// //       [name]: value,
// //     });

// //     setErrors({
// //       ...errors,
// //       [name]: "",
// //     });

// //     setServerError("");
// //   };

// //   /* =========================================================
// //      FORM VALIDATION
// //   ========================================================= */

// //   const validateForm = () => {
// //     const newErrors: Record<string, string> = {};

// //     if (!formData.phone.trim()) {
// //       newErrors.phone =
// //         "Phone number is required.";
// //     } else if (
// //       !/^01[0-9]{9}$/.test(
// //         formData.phone.trim()
// //       )
// //     ) {
// //       newErrors.phone =
// //         "Enter a valid 11-digit phone number (01XXXXXXXXX).";
// //     }

// //     if (!formData.password) {
// //       newErrors.password =
// //         "Password is required.";
// //     }

// //     setErrors(newErrors);

// //     return (
// //       Object.keys(newErrors).length === 0
// //     );
// //   };

// //   /* =========================================================
// //      LOGIN
// //   ========================================================= */

// //   const handleSubmit = async (
// //     e: React.FormEvent
// //   ) => {
// //     e.preventDefault();

// //     setServerError("");

// //     if (!validateForm()) {
// //       return;
// //     }

// //     setIsSubmitting(true);

// //     try {
// //       const response = await fetch(
// //         "http://localhost:5000/api/customer/login",
// //         {
// //           method: "POST",

// //           headers: {
// //             "Content-Type":
// //               "application/json",
// //           },

// //           body: JSON.stringify({
// //             phone:
// //               formData.phone.trim(),
// //             password:
// //               formData.password,
// //           }),
// //         }
// //       );

// //       const data =
// //         await response.json();

// //       /* -------------------------------------------------------
// //          LOGIN ERROR
// //       ------------------------------------------------------- */

// //       if (!response.ok) {
// //         setServerError(
// //           data.message ||
// //             "Invalid phone number or password."
// //         );

// //         return;
// //       }

// //       /* -------------------------------------------------------
// //          SAVE LOGIN INFORMATION
// //       ------------------------------------------------------- */

// //       localStorage.setItem(
// //         "token",
// //         data.token
// //       );

// //       localStorage.setItem(
// //         "customer",
// //         JSON.stringify(
// //           data.customer
// //         )
// //       );

// //       /* =======================================================
// //          BOOKING FLOW
         
// //          If user came from Booking page,
// //          return to that exact Booking page.
// //       ======================================================= */

// //       if (
// //         loginState?.returnTo &&
// //         loginState?.bookingState
// //       ) {
// //         navigate(
// //           loginState.returnTo,
// //           {
// //             state:
// //               loginState.bookingState,
// //             replace: true,
// //           }
// //         );

// //         return;
// //       }

// //       /* =======================================================
// //          NORMAL LOGIN
         
// //          If user did not come from Booking page,
// //          keep the original behavior.
// //       ======================================================= */

// //       navigate("/");
// //     } catch (error) {
// //       console.error(
// //         "Customer Login Error:",
// //         error
// //       );

// //       setServerError(
// //         "Unable to connect to the server. Please try again."
// //       );
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };

// //   return (
// //     <div className="login-page">

// //       <div className="login-card">

// //         {/* =================================================
// //             LOGO
// //         ================================================= */}

// //         <div className="login-logo">

// //           <button
// //             type="button"
// //             className="login-logo"
// //             onClick={() =>
// //               navigate("/")
// //             }
// //           >
// //             Rentwise
// //           </button>

// //         </div>

// //         {/* =================================================
// //             HEADER
// //         ================================================= */}

// //         <h1>
// //           Welcome Back
// //         </h1>

// //         <p className="login-subtitle">
// //           Login to continue your journey with Rentwise
// //         </p>

// //         {/* =================================================
// //             LOGIN FORM
// //         ================================================= */}

// //         <form
// //           onSubmit={handleSubmit}
// //         >

// //           {/* PHONE */}

// //           <div className="login-form-group">

// //             <label>
// //               Phone Number
// //             </label>

// //             <input
// //               type="text"
// //               name="phone"
// //               value={
// //                 formData.phone
// //               }
// //               onChange={
// //                 handleChange
// //               }
// //               placeholder="Enter your phone number"
// //               maxLength={11}
// //               inputMode="numeric"
// //             />

// //             {errors.phone && (
// //               <p className="form-error">
// //                 {errors.phone}
// //               </p>
// //             )}

// //           </div>

// //           {/* PASSWORD */}

// //           <div className="login-form-group">

// //             <label>
// //               Password
// //             </label>

// //             <PasswordInput
// //               id="login-password"
// //               name="password"
// //               value={
// //                 formData.password
// //               }
// //               onChange={
// //                 handleChange
// //               }
// //               placeholder="Enter your password"
// //             />

// //             {errors.password && (
// //               <p className="form-error">
// //                 {errors.password}
// //               </p>
// //             )}

// //           </div>

// //           {/* SERVER ERROR */}

// //           {serverError && (
// //             <div className="server-error">
// //               {serverError}
// //             </div>
// //           )}

// //           {/* OPTIONS */}

// //           <div className="login-options">

// //             <label className="remember-me">

// //               <input
// //                 type="checkbox"
// //               />

// //               <span>
// //                 Remember me
// //               </span>

// //             </label>

// //             <button
// //               type="button"
// //               className="forgot-password"
// //             >
// //               Forgot Password?
// //             </button>

// //           </div>

// //           {/* LOGIN BUTTON */}

// //           <button
// //             type="submit"
// //             className="login-submit"
// //             disabled={
// //               isSubmitting
// //             }
// //           >
// //             {isSubmitting
// //               ? "Logging in..."
// //               : "Login"}
// //           </button>

// //         </form>

// //         {/* =================================================
// //             DIVIDER
// //         ================================================= */}

// //         <div className="login-divider">
// //           <span>
// //             OR
// //           </span>
// //         </div>

// //         {/* =================================================
// //             CREATE ACCOUNT
// //         ================================================= */}

// //         <p className="register-text">

// //           Don't have an account?

// //           <button
// //             type="button"
// //             className="register-link"
// //             onClick={() =>
// //               navigate(
// //                 "/create-account"
// //               )
// //             }
// //           >
// //             Create Account
// //           </button>

// //         </p>

// //         {/* =================================================
// //             ADMIN LOGIN
// //         ================================================= */}

// //         <div className="admin-login-section">

// //           <span>
// //             Are you an administrator?
// //           </span>

// //           <button
// //             type="button"
// //             className="admin-login-link"
// //             onClick={() =>
// //               navigate(
// //                 "/admin-login"
// //               )
// //             }
// //           >
// //             Admin Login
// //           </button>

// //         </div>

// //       </div>

// //     </div>
// //   );
// // }

// // export default Login;

// import {
//   useLocation,
//   useNavigate,
// } from "react-router-dom";
// import { useState } from "react";
// import PasswordInput from "../pages/admin/AdminDashboard/components/PasswordInput";
// import "./Login.css";

// interface LoginLocationState {
//   returnTo?: string;

//   bookingState?: {
//     vehicle?: unknown;
//     searchCriteria?: unknown;
//     pickupPoint?: string;
//   };
// }

// function Login() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   /*
//    * Check whether the customer came here from
//    * the booking page.
//    */
//   const loginState =
//     location.state as LoginLocationState | null;

//   const [formData, setFormData] = useState({
//     phone: "",
//     password: "",
//   });

//   const [errors, setErrors] = useState<
//     Record<string, string>
//   >({});

//   const [serverError, setServerError] =
//     useState("");

//   const [isSubmitting, setIsSubmitting] =
//     useState(false);

//   /* =========================================================
//      HANDLE INPUT CHANGE
//   ========================================================= */

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const { name, value } = e.target;

//     setFormData({
//       ...formData,
//       [name]: value,
//     });

//     setErrors({
//       ...errors,
//       [name]: "",
//     });

//     setServerError("");
//   };

//   /* =========================================================
//      FORM VALIDATION
//   ========================================================= */

//   const validateForm = () => {
//     const newErrors: Record<string, string> = {};

//     if (!formData.phone.trim()) {
//       newErrors.phone =
//         "Phone number is required.";
//     } else if (
//       !/^01[0-9]{9}$/.test(
//         formData.phone.trim()
//       )
//     ) {
//       newErrors.phone =
//         "Enter a valid 11-digit phone number (01XXXXXXXXX).";
//     }

//     if (!formData.password) {
//       newErrors.password =
//         "Password is required.";
//     }

//     setErrors(newErrors);

//     return (
//       Object.keys(newErrors).length === 0
//     );
//   };

//   /* =========================================================
//      LOGIN
//   ========================================================= */

//   const handleSubmit = async (
//     e: React.FormEvent
//   ) => {
//     e.preventDefault();

//     setServerError("");

//     if (!validateForm()) {
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const response = await fetch(
//         "http://localhost:5000/api/customer/login",
//         {
//           method: "POST",

//           headers: {
//             "Content-Type":
//               "application/json",
//           },

//           body: JSON.stringify({
//             phone:
//               formData.phone.trim(),
//             password:
//               formData.password,
//           }),
//         }
//       );

//       const data =
//         await response.json();

//       /* -------------------------------------------------------
//          LOGIN ERROR
//       ------------------------------------------------------- */

//       if (!response.ok) {
//         setServerError(
//           data.message ||
//             "Invalid phone number or password."
//         );

//         return;
//       }

//       /* -------------------------------------------------------
//          SAVE LOGIN INFORMATION
//       ------------------------------------------------------- */

//       localStorage.setItem(
//         "token",
//         data.token
//       );

//       localStorage.setItem(
//         "customer",
//         JSON.stringify(
//           data.customer
//         )
//       );

//       /* =======================================================
//          BOOKING FLOW - DIRECT STATE
         
//          If the user came from the Booking page,
//          return to that exact Booking page.
//       ======================================================= */

//       if (
//         loginState?.returnTo &&
//         loginState?.bookingState
//       ) {
//         navigate(
//           loginState.returnTo,
//           {
//             state:
//               loginState.bookingState,
//             replace: true,
//           }
//         );

//         return;
//       }

//       /* =======================================================
//          BOOKING FLOW - LOCAL STORAGE FALLBACK
         
//          This handles the case where the user:
         
//          Booking
//            ↓
//          Login
//            ↓
//          Create Account
//            ↓
//          Login
         
//          and React Router state is no longer available.
//       ======================================================= */

//       const pending =
//         localStorage.getItem(
//           "rentwisePendingBooking"
//         );

//       if (pending) {
//         try {
//           const parsed =
//             JSON.parse(pending);

//           const vehicleId =
//             parsed.vehicleId ||
//             parsed.vehicle?.id;

//           if (vehicleId) {
//             navigate(
//               `/booking/${vehicleId}`,
//               {
//                 state: {
//                   vehicle:
//                     parsed.vehicle,
//                   searchCriteria:
//                     parsed.searchCriteria,
//                   pickupPoint:
//                     parsed.pickupPoint,
//                 },
//                 replace: true,
//               }
//             );

//             return;
//           }
//         } catch (error) {
//           console.error(
//             "Invalid pending booking data:",
//             error
//           );

//           localStorage.removeItem(
//             "rentwisePendingBooking"
//           );
//         }
//       }

//       /* =======================================================
//          NORMAL LOGIN
         
//          If the user did not come from Booking and
//          there is no pending booking, go to Home.
//       ======================================================= */

//       navigate("/");
//     } catch (error) {
//       console.error(
//         "Customer Login Error:",
//         error
//       );

//       setServerError(
//         "Unable to connect to the server. Please try again."
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="login-page">

//       <div className="login-card">

//         {/* =================================================
//             LOGO
//         ================================================= */}

//         <div className="login-logo">

//           <button
//             type="button"
//             className="login-logo"
//             onClick={() =>
//               navigate("/")
//             }
//           >
//             Rentwise
//           </button>

//         </div>

//         {/* =================================================
//             HEADER
//         ================================================= */}

//         <h1>
//           Welcome Back
//         </h1>

//         <p className="login-subtitle">
//           Login to continue your journey with Rentwise
//         </p>

//         {/* =================================================
//             LOGIN FORM
//         ================================================= */}

//         <form
//           onSubmit={handleSubmit}
//         >

//           {/* PHONE */}

//           <div className="login-form-group">

//             <label>
//               Phone Number
//             </label>

//             <input
//               type="text"
//               name="phone"
//               value={
//                 formData.phone
//               }
//               onChange={
//                 handleChange
//               }
//               placeholder="Enter your phone number"
//               maxLength={11}
//               inputMode="numeric"
//             />

//             {errors.phone && (
//               <p className="form-error">
//                 {errors.phone}
//               </p>
//             )}

//           </div>

//           {/* PASSWORD */}

//           <div className="login-form-group">

//             <label>
//               Password
//             </label>

//             <PasswordInput
//               id="login-password"
//               name="password"
//               value={
//                 formData.password
//               }
//               onChange={
//                 handleChange
//               }
//               placeholder="Enter your password"
//             />

//             {errors.password && (
//               <p className="form-error">
//                 {errors.password}
//               </p>
//             )}

//           </div>

//           {/* SERVER ERROR */}

//           {serverError && (
//             <div className="server-error">
//               {serverError}
//             </div>
//           )}

//           {/* OPTIONS */}

//           <div className="login-options">

//             <label className="remember-me">

//               <input
//                 type="checkbox"
//               />

//               <span>
//                 Remember me
//               </span>

//             </label>

//             <button
//               type="button"
//               className="forgot-password"
//             >
//               Forgot Password?
//             </button>

//           </div>

//           {/* LOGIN BUTTON */}

//           <button
//             type="submit"
//             className="login-submit"
//             disabled={
//               isSubmitting
//             }
//           >
//             {isSubmitting
//               ? "Logging in..."
//               : "Login"}
//           </button>

//         </form>

//         {/* =================================================
//             DIVIDER
//         ================================================= */}

//         <div className="login-divider">
//           <span>
//             OR
//           </span>
//         </div>

//         {/* =================================================
//             CREATE ACCOUNT
//         ================================================= */}

//         <p className="register-text">

//           Don't have an account?

//           <button
//             type="button"
//             className="register-link"
//             onClick={() =>
//               navigate(
//                 "/create-account",
//                 {
//                   state: {
//                     returnTo:
//                       loginState?.returnTo,
//                     bookingState:
//                       loginState?.bookingState,
//                   },
//                 }
//               )
//             }
//           >
//             Create Account
//           </button>

//         </p>

//         {/* =================================================
//             ADMIN LOGIN
//         ================================================= */}

//         <div className="admin-login-section">

//           <span>
//             Are you an administrator?
//           </span>

//           <button
//             type="button"
//             className="admin-login-link"
//             onClick={() =>
//               navigate(
//                 "/admin-login"
//               )
//             }
//           >
//             Admin Login
//           </button>

//         </div>

//       </div>

//     </div>
//   );
// }

// export default Login;

import {
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useState } from "react";
import PasswordInput from "../pages/admin/AdminDashboard/components/PasswordInput";
import "./Login.css";

interface LoginLocationState {
  returnTo?: string;

  bookingState?: {
    vehicle?: unknown;
    searchCriteria?: unknown;
    pickupPoint?: string;
  };
}

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  /*
   * Check whether the customer came here from
   * the booking page.
   */
  const loginState =
    location.state as LoginLocationState | null;

  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState<
    Record<string, string>
  >({});

  const [serverError, setServerError] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  /* =========================================================
     HANDLE INPUT CHANGE
  ========================================================= */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    /*
     * PHONE NUMBER:
     * Only allow numeric characters.
     *
     * Example:
     * 5851       -> allowed
     * 01712345678 -> allowed
     * abcd       -> blocked
     * 017abc     -> only numeric part remains
     */
    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "");

      setFormData({
        ...formData,
        phone: numericValue,
      });

      setErrors({
        ...errors,
        phone: "",
      });

      setServerError("");

      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });

    setServerError("");
  };

  /* =========================================================
     FORM VALIDATION
  ========================================================= */

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.phone.trim()) {
      newErrors.phone =
        "Phone number is required.";
    } else if (
      !/^01[0-9]{9}$/.test(
        formData.phone.trim()
      )
    ) {
      newErrors.phone =
        "Enter a valid 11-digit phone number (01XXXXXXXXX).";
    }

    if (!formData.password) {
      newErrors.password =
        "Password is required.";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  /* =========================================================
     LOGIN
  ========================================================= */

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setServerError("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/customer/login",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            phone:
              formData.phone.trim(),
            password:
              formData.password,
          }),
        }
      );

      const data =
        await response.json();

      /* -------------------------------------------------------
         LOGIN ERROR
      ------------------------------------------------------- */

      if (!response.ok) {
        setServerError(
          data.message ||
            "Invalid phone number or password."
        );

        return;
      }

      /* -------------------------------------------------------
         SAVE LOGIN INFORMATION
      ------------------------------------------------------- */

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "customer",
        JSON.stringify(
          data.customer
        )
      );

      /* =======================================================
         BOOKING FLOW - DIRECT STATE

         If the user came from the Booking page,
         return to that exact Booking page.
      ======================================================= */

      if (
        loginState?.returnTo &&
        loginState?.bookingState
      ) {
        navigate(
          loginState.returnTo,
          {
            state:
              loginState.bookingState,
            replace: true,
          }
        );

        return;
      }

      /* =======================================================
         BOOKING FLOW - LOCAL STORAGE FALLBACK

         This handles the case where the user:

         Booking
           ↓
         Login
           ↓
         Create Account
           ↓
         Login

         and React Router state is no longer available.
      ======================================================= */

      const pending =
        localStorage.getItem(
          "rentwisePendingBooking"
        );

      if (pending) {
        try {
          const parsed =
            JSON.parse(pending);

          const vehicleId =
            parsed.vehicleId ||
            parsed.vehicle?.id;

          if (vehicleId) {
            navigate(
              `/booking/${vehicleId}`,
              {
                state: {
                  vehicle:
                    parsed.vehicle,
                  searchCriteria:
                    parsed.searchCriteria,
                  pickupPoint:
                    parsed.pickupPoint,
                },
                replace: true,
              }
            );

            return;
          }
        } catch (error) {
          console.error(
            "Invalid pending booking data:",
            error
          );

          localStorage.removeItem(
            "rentwisePendingBooking"
          );
        }
      }

      /* =======================================================
         NORMAL LOGIN

         If the user did not come from Booking and
         there is no pending booking, go to Home.
      ======================================================= */

      navigate("/");
    } catch (error) {
      console.error(
        "Customer Login Error:",
        error
      );

      setServerError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        {/* =================================================
            LOGO
        ================================================= */}

        <div className="login-logo">

          <button
            type="button"
            className="login-logo"
            onClick={() =>
              navigate("/")
            }
          >
            Rentwise
          </button>

        </div>

        {/* =================================================
            HEADER
        ================================================= */}

        <h1>
          Welcome Back
        </h1>

        <p className="login-subtitle">
          Login to continue your journey with Rentwise
        </p>

        {/* =================================================
            LOGIN FORM
        ================================================= */}

        <form
          onSubmit={handleSubmit}
        >

          {/* PHONE */}

          <div className="login-form-group">

            <label>
              Phone Number
            </label>

            <input
              type="text"
              name="phone"
              value={
                formData.phone
              }
              onChange={
                handleChange
              }
              placeholder="Enter your phone number"
              maxLength={11}
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="tel"
            />

            {errors.phone && (
              <p className="form-error">
                {errors.phone}
              </p>
            )}

          </div>

          {/* PASSWORD */}

          <div className="login-form-group">

            <label>
              Password
            </label>

            <PasswordInput
              id="login-password"
              name="password"
              value={
                formData.password
              }
              onChange={
                handleChange
              }
              placeholder="Enter your password"
            />

            {errors.password && (
              <p className="form-error">
                {errors.password}
              </p>
            )}

          </div>

          {/* SERVER ERROR */}

          {serverError && (
            <div className="server-error">
              {serverError}
            </div>
          )}

          {/* OPTIONS */}

          <div className="login-options">

            <label className="remember-me">

              <input
                type="checkbox"
              />

              <span>
                Remember me
              </span>

            </label>

            <button
              type="button"
              className="forgot-password"
            >
              Forgot Password?
            </button>

          </div>

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="login-submit"
            disabled={
              isSubmitting
            }
          >
            {isSubmitting
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

        {/* =================================================
            DIVIDER
        ================================================= */}

        <div className="login-divider">
          <span>
            OR
          </span>
        </div>

        {/* =================================================
            CREATE ACCOUNT
        ================================================= */}

        <p className="register-text">

          Don't have an account?

          <button
            type="button"
            className="register-link"
            onClick={() =>
              navigate(
                "/create-account",
                {
                  state: {
                    returnTo:
                      loginState?.returnTo,
                    bookingState:
                      loginState?.bookingState,
                  },
                }
              )
            }
          >
            Create Account
          </button>

        </p>

        {/* =================================================
            ADMIN LOGIN
        ================================================= */}

        <div className="admin-login-section">

          <span>
            Are you an administrator?
          </span>

          <button
            type="button"
            className="admin-login-link"
            onClick={() =>
              navigate(
                "/admin-login"
              )
            }
          >
            Admin Login
          </button>

        </div>

      </div>

    </div>
  );
}

export default Login;