"use client"

import { useState, useEffect, useRef } from "react"
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
  const [nbWins, setNbWins] = useState(0);
  // TODO: Ajouter 3 variables: Le multiplier, le multiplierCost, mais également le multiplierIntialCost pour remettre à jour multiplierCost après chaque fin de round (ou sinon on peut passer l'information dans l'appel qui vient du Hub!)
  const [multiplier, setMultiplier] = useState(1);
  const [multiplierCost, setMultiplierCost] = useState(0);
  const [multiplierInitialCost, setMultiplierInitialCost] = useState(0);

  const multiplierInitialCostRef = useRef(multiplierInitialCost);

  useEffect(() => {
    multiplierInitialCostRef.current = multiplierInitialCost;
  }, [multiplierInitialCost]);

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
      setMultiplierInitialCost(data.multiplierCost);
      setMultiplierCost(data.multiplierCost);
      setNbWins(data.nbWins);
    });

    newHubConnection.on('EndRound', (data:RoundResult) => {
      setNbClicks(0);
      
      // TODO: Reset du multiplierCost et le multiplier
      setMultiplierCost(multiplierInitialCostRef.current);
      setMultiplier(1);

      let username = sessionStorage.getItem("username");

      // TODO: Si le joueur a gagné, on augmene nbWins
      if(data.winners != null && data.winners.indexOf(username!) >= 0)
        setNbWins(nbWins => nbWins + 1);

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
    setNbClicks(nbClicks + multiplier);
    hubConnection!.invoke('Increment')
  }

  function BuyMultiplier() {
    // TODO: Implémenter la méthode qui permet d'acheter un niveau de multiplier (Appel au Hub!)
    if(nbClicks >= multiplierCost)
    {
      hubConnection!.invoke('BuyMultiplier');
      setNbClicks(nbClicks - multiplierCost);
      setMultiplier(multiplier * 2);
      setMultiplierCost(multiplierCost * 2);
    }
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
          <div >Connecté! Vous avez eu <b>{nbWins}</b> victoires!</div>
          <br />
          <div>
            <Button className="mr-2" variant="default" onClick={Increment}>Cliquer</Button>
            Clicks dans ce round: <b>{nbClicks}</b>
          </div>
          {/* Permettre d'acheter un multiplier et afficher le multiplier actuel */}
          <div>
        <Button disabled={nbClicks < multiplierCost} variant="default" onClick={BuyMultiplier}>Acheter pour {multiplierCost}</Button>
        Multiplicateur: <b>{multiplier}</b>
      </div>
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
