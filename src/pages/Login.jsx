import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/api"

const login = () => {
  const [formData, setFormData] = useState({ username: "", password: ""})
  const [error, setError] = useState("")
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post("/login/", formData)
      .then((response) => {
        localStorage.setItem("token", response.data.access);
        navigate("/dashboard")
      })
  }
}
