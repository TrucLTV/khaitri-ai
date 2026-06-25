import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './Layout'
import Home from '../pages/Home'
import LessonDetail from '../pages/LessonDetail'
import Resources from '../pages/Resources'
import Teacher from '../pages/Teacher'
import Timer from '../tools/timer/Timer'
import Quiz from '../tools/quiz/Quiz'
import Rubric from '../tools/rubric/Rubric'

export default function Router() {
  return (
    <BrowserRouter basename="/khaitri-ai">
      <Layout>
        <Routes>
          <Route path="/"           element={<Home />}         />
          <Route path="/lesson/:id" element={<LessonDetail />} />
          <Route path="/resources"  element={<Resources />}    />
          <Route path="/teacher"    element={<Teacher />}      />
          <Route path="/timer"      element={<Timer />}        />
          <Route path="/quiz"       element={<Quiz />}         />
          <Route path="/rubric"     element={<Rubric />}       />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
