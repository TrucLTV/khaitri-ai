import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './Layout'
import Home from '../pages/Home'
import LessonDetail from '../pages/LessonDetail'
import Resources from '../pages/Resources'
import Teacher from '../pages/Teacher'

export default function Router() {
  return (
    <BrowserRouter basename="/khaitri-ai">
      <Layout>
        <Routes>
          <Route path="/"           element={<Home />}         />
          <Route path="/lesson/:id" element={<LessonDetail />} />
          <Route path="/resources"  element={<Resources />}    />
          <Route path="/teacher"    element={<Teacher />}      />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
