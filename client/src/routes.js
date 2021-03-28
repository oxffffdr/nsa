import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import { AuthPage } from './pages/AuthPage'
import { LinksPage } from './pages/LinksPage'
import { CreatePage } from './pages/CreatePage'
import { DetailPage } from './pages/DetailPage'

    
export  const useRoutes = isAuthenficated =>{
    if (isAuthenficated){
        return (
            <Switch> 
                       <Route path="/links" exact>
                            <LinksPage />    
                       </Route> 
                       <Route path="/Detail/:id">
                            <DetailPage />    
                       </Route> 
                       <Route path="/Create" exact> 
                            <CreatePage />    
                       </Route> 
                       <Redirect to="/create">
                           
                       </Redirect>
            </Switch>
        )
    } else {
        return(
        <Switch>
                <Route path='/' exact>
                    <AuthPage></AuthPage>
                </Route>
                <Redirect to="/"></Redirect>
        </Switch>
        )
    }
}
