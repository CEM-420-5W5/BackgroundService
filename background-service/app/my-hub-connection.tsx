'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "./base/button";
import { BorderedContainer } from "./bordered-container";
import { Field, FieldLabel } from "./base/field";
import { Input } from "./base/input";

export interface LoginViewProps {
    apiUrl?: string;
    onLoginSuccess?: (username: string, token: string) => void;
}

export function MyHubConnection({ apiUrl = "http://localhost:5011/api/Account", onLoginSuccess }: LoginViewProps) {

    const [token, setToken] = useState<string | null>(null);
    const [loggedInUsername, setLoggedInUsername] = useState<string | null>(null);
    const [username, setUsername] = useState("test");
    const [isClient, setIsClient] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const password = "Passw0rd!";

    useEffect(() => {
        setIsClient(true);
        
        const tokenJSON : string | null = sessionStorage.getItem("token");
        setToken(tokenJSON);

        const usernameJSON : string | null = sessionStorage.getItem("username");
        setLoggedInUsername(usernameJSON);
    }, []);

    async function enregistrer(){
        setIsLoading(true);
        setErrorMessage(null);
        try {
            let registerData = {
                username: username,
                email : username + "@test.com",
                password : password,
                passwordConfirm : password,
            }
            await axios.post(apiUrl + "/Register", registerData);
            setErrorMessage(null);
        } catch (error) {
            setErrorMessage("Erreur lors de l'enregistrement");
        } finally {
            setIsLoading(false);
        }
    }

    async function login(){
        setIsLoading(true);
        setErrorMessage(null);
        try {
            let loginData = {
                username: username,
                password: password
            }
            const result = await axios.post(apiUrl + "/Login", loginData);
            sessionStorage.setItem("token", result.data.token);
            sessionStorage.setItem("username", result.data.username);
            setToken(result.data.token);
            setLoggedInUsername(result.data.username);
            onLoginSuccess?.(result.data.username, result.data.token);
        } catch (error) {
            setErrorMessage("Nom d'utilisateur ou mot de passe incorrect");
        } finally {
            setIsLoading(false);
        }
    }

    async function logout(){
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("username");
        setToken(null);
        setLoggedInUsername(null);
    }

    function isLoggedIn() : boolean{
        return token != null;
    }

    function displayLogin(){
        if(!isLoggedIn()){
            return(
                <div className="w-full max-w-md mx-auto">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold mb-2">Connexion</h2>
                    </div>

                    {errorMessage && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {errorMessage}
                        </div>
                    )}
                    
                    <Field className="mb-4">
                        <FieldLabel htmlFor="input-field-username">Nom d'utilisateur</FieldLabel>
                        <Input
                            id="input-field-username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Entrez votre nom d'utilisateur"
                            disabled={isLoading}
                        />      
                    </Field>

                    <div className="flex gap-3 pt-2">
                        <Button 
                            variant="secondary" 
                            onClick={enregistrer}
                            disabled={isLoading}
                            className="flex-1"
                        >
                            {isLoading ? "Chargement..." : "Enregistrer"}
                        </Button>
                        <Button 
                            onClick={login}
                            disabled={isLoading}
                            className="flex-1"
                        >
                            {isLoading ? "Chargement..." : "Connexion"}
                        </Button>
                    </div>
                </div>
            );
        }
        else{
            return (
                <div className="w-full">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Connecté en tant que</p>
                            <p className="text-xl font-bold">{loggedInUsername}</p>
                        </div>
                        <Button 
                            variant="secondary"
                            onClick={logout}
                        >
                            Déconnexion
                        </Button>
                    </div>
                </div>
            );
        }
    }

    if (!isClient) {
        return null;
    }

    return(
        <BorderedContainer>
            {displayLogin()}   
        </BorderedContainer>
    );
}