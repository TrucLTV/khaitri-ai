import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'
import Layout from './Layout'
import Home from '../pages/Home'
import LessonDetail from '../pages/LessonDetail'
import Resources from '../pages/Resources'
import Teacher from '../pages/Teacher'
import Timer from '../tools/timer/Timer'
import Quiz from '../tools/quiz/Quiz'
import QuizStats from '../tools/quiz/QuizStats'
import Rubric from '../tools/rubric/Rubric'
import Voting from '../tools/voting/Voting'
import Padlet from '../tools/padlet/Padlet'
import GroupDashboard from '../tools/group/GroupDashboard'

function VoteJoin() {
  const { code } = useParams()
  return <Voting studentCode={code} />
}

function PadletJoin() {
  const { code } = useParams()
  return <Padlet studentCode={code} />
}

export default function Router() {
  return (
    <BrowserRouter basename="/khaitri-ai">
      <Layout>
        <Routes>
          <Route path="/"              element={<Home />}           />
          <Route path="/lesson/:id"    element={<LessonDetail />}   />
          <Route path="/resources"     element={<Resources />}      />
          <Route path="/teacher"       element={<Teacher />}        />
          <Route path="/timer"         element={<Timer />}          />
          <Route path="/quiz"          element={<Quiz />}           />
          <Route path="/quiz-stats"    element={<QuizStats />}      />
          <Route path="/rubric"        element={<Rubric />}         />
          <Route path="/voting"        element={<Voting />}         />
          <Route path="/vote/:code"    element={<VoteJoin />}       />
          <Route path="/padlet"        element={<Padlet />}         />
          <Route path="/padlet/:code"  element={<PadletJoin />}     />
          <Route path="/groups"        element={<GroupDashboard />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
