import { useNavigate } from "react-router-dom";
import Button from "../../commons/button/Button";
import Header from "../../commons/header/Header";
import Footer from "../../commons/footer/Footer";
import "./NotFoundPage.css";

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate("/");
  };

  return (
    <>
      <Header />
      <div className="flex items-center justify-center min-h-screen px-4 bg-white">
        <div className="text-center">
          <h1 className="text-8xl font-bold text-brand-blue mb-4">404</h1>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Ops!</h2>
          <p className="text-xl text-gray-600 mb-8">
            A página que você procura não foi encontrada.
          </p>
          <Button 
            variant="primary" 
            size="large" 
            onClick={handleBackHome}
          >
            Voltar para o Início
          </Button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NotFoundPage;
