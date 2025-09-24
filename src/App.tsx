import { AnimatePresence, motion } from 'framer-motion';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Layout } from './components/layout';
import { HomePage } from './pages/home';
import { CaseStudyPage } from './pages/case-study';
import { ResumePage } from './pages/resume';
import { StorybookPage } from './pages/storybook';
import { NotFoundPage } from './pages/not-found';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 }
};

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <Layout>
              <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.35 }}>
                <HomePage />
              </motion.div>
            </Layout>
          }
        />
        <Route
          path="/projects/:owner/:repo/case-study"
          element={
            <Layout>
              <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.35 }}>
                <CaseStudyPage />
              </motion.div>
            </Layout>
          }
        />
        <Route
          path="/resume"
          element={
            <Layout>
              <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.35 }}>
                <ResumePage />
              </motion.div>
            </Layout>
          }
        />
        <Route
          path="/storybook"
          element={
            <Layout>
              <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.35 }}>
                <StorybookPage />
              </motion.div>
            </Layout>
          }
        />
        <Route
          path="*"
          element={
            <Layout>
              <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.35 }}>
                <NotFoundPage />
              </motion.div>
            </Layout>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}
