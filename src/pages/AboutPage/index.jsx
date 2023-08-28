import Footer from '../../components/Footer';
import Header from '../../components/Header/index';
import NavBar from '../../components/NavBar';
import HomeLinkBlack from '../../components/HomeLink';
import './styles.scss';

const AboutPage = () => {


  return (
    <div>
      <HomeLinkBlack />
      <Header />
      <NavBar />
      <main className="about-page">

      <h1>Bienvenue sur Le Blog du Gamer !</h1>

    <h2>Salut à tous les gamers !</h2>
    <p>Si vous êtes ici, c'est que comme moi, vous avez une passion dévorante pour les jeux vidéo et la technologie. Bienvenue dans cet espace où chaque pixel et chaque ligne de code sont célébrés avec enthousiasme.</p>
    <p>Dans ce coin du web, nous plongeons dans l'univers palpitant des jeux vidéo. Des analyses aux tests approfondis, nous explorons chaque recoin des mondes virtuels, découvrons les mécaniques les plus ingénieuses et partageons nos réflexions sur les tendances qui façonnent l'industrie.</p>
    <p>Alors, que vous soyez un vétéran des manettes ou un nerd de la technologie, vous êtes ici chez vous. Partageons nos découvertes, nos astuces et nos moments épiques. Car c'est ensemble que nous créons une communauté dynamique, où les discussions sur les jeux et la tech n'ont jamais de fin.</p>
    <p>Que la manette soit toujours à portée de main</p>

    <p>Gyoza, créateur du Blog du Gamer.</p>
  
        </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
