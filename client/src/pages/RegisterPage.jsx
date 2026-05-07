import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RegisterPage = () => {
  const { register } = useAuth();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    dob: "",
    gender: "",
    hobbies: "",
    profession: "",
    bio: "",
    phone: "",
    profileImage: "",
  });
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match");
    }
    try {
      setError("");
      const submitData = new FormData();
      Object.keys(form).forEach(key => {
        if (key !== "profileImage" && key !== "confirmPassword") {
          submitData.append(key, form[key] || "");
        }
      });
      if (profileImageFile) {
        submitData.append("profileImage", profileImageFile);
      }
      
      await register(submitData);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create account");
    }
  };

  return (
    <main className="register-shell">
      <section className="register-card">
        <h2>Register Your Journal</h2>
        <p className="register-lead">
          Create a space that feels like your own handwritten manuscript.
        </p>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="row two-col">
            <label>
              Full Name
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Your full name"
              />
            </label>
            <label>
              Email
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
            </label>
          </div>
          <div className="row two-col">
            <label>
              Username
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Journal name"
              />
            </label>
            <label>
              Password
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Choose a secret"
              />
            </label>
          </div>
          <div className="row two-col">
            <label>
              Confirm Password
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat your secret"
              />
            </label>
            <label>
              DOB
              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="row two-col">
            <label>
              Gender
              <input
                name="gender"
                value={form.gender}
                onChange={handleChange}
                placeholder="She / He / They / Other"
              />
            </label>
            <label>
              Profession
              <input
                name="profession"
                value={form.profession}
                onChange={handleChange}
                placeholder="Your craft"
              />
            </label>
          </div>
          <label>
            Hobbies
            <input
              name="hobbies"
              value={form.hobbies}
              onChange={handleChange}
              placeholder="What fuels you"
            />
          </label>
          <label>
            Bio / About
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows="4"
              placeholder="A short note about who you are"
            />
          </label>
          <label>
            Phone Number
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Optional"
            />
          </label>
          <label>
            Profile Image
            <input
              type="file"
              name="profileImage"
              accept="image/*"
              onChange={(e) => setProfileImageFile(e.target.files[0])}
            />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button className="ink-button">Begin the Journey</button>
          <p className="login-note">
            Already have an account? <Link to="/">Open the cover</Link>
          </p>
        </form>
      </section>
    </main>
  );
};

export default RegisterPage;
