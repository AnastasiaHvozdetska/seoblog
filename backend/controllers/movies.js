const handleRequest = require("../request")
const Movies = require("../models/movies-model")

const CreateMovies = handleRequest(async (body) => {
  const newModel = new Movie(body)
  return await newModel.save()
})

const postMovies = handleRequest(async (body) => {
  const newModel = new Movies(body)
  return await newModel.save()
})

const getMovies = handleRequest(async () => {
  const datas = await Movies.find()
  console.log(datas, "datas")
  return datas
})

const getMoviesById = handleRequest(async (body, id) => {
  const data = await Movies.findById(id)
  if (!data) throw new Error("Movie not found")
  return data
})

const putMoviesById = handleRequest(async (body, id) => {
  const data = await Movies.findByIdAndUpdate(id, body, {
    new: true,
  })
  if (!data) throw new Error("Movie not found")
  return data
})

const deleteMoviesById = handleRequest(async (body, id) => {
  const data = await Movies.findByIdAndDelete(id)
  if (!data) throw new Error("Movie not found")
  return data
})

module.exports = {
  postMovies,
  getMovies,
  getMoviesById,
  putMoviesById,
  deleteMoviesById,
}
