import Footer from "../../components/Footer";
import Header from "../../components/Header/index";
import NavBar from "../../components/NavBar";
import "./styles.scss"

const HomePage = () => {

    return (
        <div>
            <Header />
            <NavBar />
            <main className="homepage">
                <p>Ici on va mettre les dernières news du site </p>
            </main>
            <Footer />
        </div>
    )

}

export default HomePage;