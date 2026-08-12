"use client"

import { useState } from "react"
import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr"

import { Button, BorderedContainer, LoginView } from "ui-exercices-5w5"

const serverUrl = "http://localhost:5080/"
const loginUrl = serverUrl + "api/Account"
const hubUrl = serverUrl + "game"

interface RoundResult{
  winners:string[],
  nbClicks:number
}

interface GameInfo{
  multiplierCost:number,
  nbWins:number;
}

export default function Home() {

  const [hubConnection, setHubConnection] = useState<HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [nbClicks, setNbClicks] = useState(0);

  // TODO: Ajouter une variable nbWins
  // TODO: Ajouter 3 variables: Le multiplier, le multiplierCost, mais également le multiplierIntialCost pour remettre à jour multiplierCost après chaque fin de round (ou sinon on peut passer l'information dans l'appel qui vient du Hub!)


  function connectToHub() {
    const newHubConnection = new HubConnectionBuilder()
                              .withUrl(hubUrl, { accessTokenFactory: () => sessionStorage.getItem("token")! })
                              .withAutomaticReconnect()
                              .configureLogging(LogLevel.Information)
                              .build();

    if(!newHubConnection)
    {
      console.log("Impossible de créer un HubConnection???");
      return;
    }

    newHubConnection.on('GameInfo', (data:GameInfo) => {
      console.log("Réception de GameInfo: multiplierCost=" + data.multiplierCost + ", nbWins=" + data.nbWins);
      setIsConnected(true);
      // TODO: Mettre à jour les variables pour le coût du multiplier et le nbWins
    });

    newHubConnection.on('EndRound', (data:RoundResult) => {
      setNbClicks(0);
      // TODO: Reset du multiplierCost et le multiplier

      // TODO: Si le joueur a gagné, on augmene nbWins

      if(data.nbClicks > 0){
        let phrase = " a gagné avec ";
        if(data.winners.length > 1)
          phrase = " ont gagnées avec "
        alert(data.winners.join(", ") + phrase + data.nbClicks + " clicks!");
      }
      else{
        alert("Aucun gagnant...");
      }
    });

    newHubConnection
      .start()
      .then(() => {
        console.log("Connecté au Hub");
      })
      .catch(err => console.log('Error while starting connection: ' + err))

    setHubConnection(newHubConnection);
  }

  function Increment() {
    //TODO: Augmenter le nbClicks par la valeur du multiplicateur
    setNbClicks(nbClicks + 1);
    hubConnection!.invoke('Increment')
  }

  function BuyMultiplier() {
    // TODO: Implémenter la méthode qui permet d'acheter un niveau de multiplier (Appel au Hub!)
  }

  function logout() {
    console.log("L'utilisateur se déconnecte, on arrête le HubConnection");
    if(hubConnection){
      hubConnection.stop();
      setHubConnection(null);
    }
    setIsConnected(false);
  }

  function RenderContent(){
    if(!isConnected){
      return (
        <div>
          <div >Pas connecté au Hub..</div>
          <br></br>
          <Button variant="secondary" onClick={connectToHub}>Se connecter au Hub</Button>
        </div>
      );
    }
    else{
      return (
        <div>
          <div >Connecté! {/*TODO: Afficher le nb de wins*/}</div>
          <br />
          <div>
            <Button className="mr-2" variant="default" onClick={Increment}>Cliquer</Button>
            Clicks dans ce round: <b>{nbClicks}</b>
          </div>
          {/* Permettre d'acheter un multiplier et afficher le multiplier actuel */}
        </div>
      );
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2 p-2">Background Service</h1>
      <div className="p-2 max-w-[700px]">
        <LoginView apiUrl={loginUrl} onLogout={logout} />
        <BorderedContainer className="p-6 mt-2">
          {RenderContent()}
        </BorderedContainer>
      </div>
    </div>
  );
}
