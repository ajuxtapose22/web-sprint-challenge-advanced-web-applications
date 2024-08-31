import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axios from 'axios'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  const navigate = useNavigate()
  const redirectToLogin = () => {navigate('/') }
  const redirectToArticles = () => { navigate('/articles') }

  const logout = () => {
    localStorage.removeItem('token')
    setMessage("Goodbye!")
    redirectToLogin()
  }

  const login = ({ username, password }) => {
    setMessage('')
    setSpinnerOn(true)
    axios.post(loginUrl, {
      username: username.trim(),
      password: password.trim()
    })
    .then(response => {
      localStorage.setItem('token', response.data.token)
      setMessage(`Here are your articles, ${username}`)
      redirectToArticles()
    })
    .catch(err => {
      setMessage('Login Failed')
      console.error(err)
    })
    .finally(() => {
      setSpinnerOn(false)
    })
  }

  const getArticles = () => {
    setMessage('')
    setSpinnerOn(true)
    const token = localStorage.getItem('token')
    axios.get(articlesUrl, {
      headers: { 
        Authorization: token
      }
    })
    .then((response) => {
      setArticles(response.data.articles)
      setMessage(response.data.message)
    })
    .catch((err) => {
      if(err.response && err.response.status === 401) {
        setMessage('Login Failed')
        redirectToLogin()
      } else {
        setMessage("Failed to GET Articles")
      }
      console.error(err)
    })
    .finally(() => {
      setSpinnerOn(false)
    })
  }

  const postArticle = article => {
    setMessage('')
    setSpinnerOn(true)
    const token = localStorage.getItem('token')
    axios.post(articlesUrl, article, {
      headers: { 
        Authorization: token
      }
    })
    .then((response) => {
      setArticles([...articles, response.data.article])
      setMessage(response.data.message)
    })
    .catch((err) => {
        setMessage('Failed to POST Article')
        console.error(err)
    })
    .finally(() => {
      setSpinnerOn(false)
    })
  }

  const updateArticle = ({ article_id, article }) => {
    // ✨ implement
    // You got this!

  }

  const deleteArticle = article_id => {
    // ✨ implement
    
  }


  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn} />
      <Message message={message}/>
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login}/>} />
          <Route path="articles" element={
            <>
              <ArticleForm postArticle={postArticle} />
              <Articles 
                getArticles={getArticles}
                articles={articles}
                deleteArticle={deleteArticle}
                setCurrentArticleId={setCurrentArticleId}
                currentArticleId={currentArticleId}/>
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2024</footer>
      </div>
    </>
  )
}
