import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import WorkerSection from './components/WorkerSection';
import EmployerSection from './components/EmployerSection';
import CommunityHubs from './components/CommunityHubs';
import Contact from './components/Contact';
import Footer from './components/Footer';
import WorkerDashboard from './components/WorkerDashboard';
import EmployerDashboard from './components/EmployerDashboard';
import EmployerLogin from './components/EmployerLogin';
import EmployerSignup from './components/EmployerSignup';
import WorkerLogin from './components/WorkerLogin';
import WorkerSignup from './components/WorkerSignup';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  const [activeSection, setActiveSection] = useState('home');

  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return (
          <>
            <Hero 
              onJoinAsWorker={() => setActiveSection('worker-auth')} 
              onFindWorkers={() => setActiveSection('employer-auth')} 
            />
            <Services />
            <About />
          </>
        );
      case 'community':
        return <CommunityHubs />;
      case 'contact':
        return <Contact />;
      
      // Worker Authentication Flow: Home → "Join as Worker" → Worker Login → Worker Dashboard
      case 'worker-auth':
        return <WorkerLogin 
          onLoginSuccess={() => setActiveSection('worker-dashboard')} 
          onSignupClick={() => setActiveSection('worker-signup')} 
        />;
      case 'worker-signup':
        return <WorkerSignup 
          onSignupComplete={() => setActiveSection('worker-dashboard')} 
          onLoginClick={() => setActiveSection('worker-auth')} 
        />;
      case 'worker-dashboard':
        return <WorkerDashboard />;
      
      // Employer Authentication Flow: Home → "Find Workers" → Employer Login → Employer Dashboard
      case 'employer-auth':
        return <EmployerLogin 
          onLoginSuccess={() => setActiveSection('employer-dashboard')} 
          onSignupClick={() => setActiveSection('employer-signup')} 
        />;
      case 'employer-signup':
        return <EmployerSignup 
          onSignupComplete={() => setActiveSection('employer-dashboard')} 
          onLoginClick={() => setActiveSection('employer-auth')} 
        />;
      case 'employer-dashboard':
        return <EmployerDashboard />;
      
      default:
        return (
          <>
            <Hero 
              onJoinAsWorker={() => setActiveSection('worker-auth')} 
              onFindWorkers={() => setActiveSection('employer-auth')} 
            />
            <Services />
            <About />
          </>
        );
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-[#106EBE] to-blue-800">
        <Header activeSection={activeSection} setActiveSection={setActiveSection} />
        <main>
          {renderContent()}
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;