import { Suspense } from "react"
import { Routes, Route } from "react-router-dom"
import routes from "./routes"

const AppRouter = () => {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <Routes>
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={<route.component />}
          />
        ))}
      </Routes>
    </Suspense>
  )
}

export default AppRouter
