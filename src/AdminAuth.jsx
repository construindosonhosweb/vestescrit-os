import React,{useEffect,useState}from'react';
import{ShieldCheck}from'lucide-react';
import{supabase}from'./lib/supabase';
import Admin from'./Admin';
import'./admin.css';

export default function AdminAuth({onExit}){
 const[email,setEmail]=useState('');
 const[password,setPassword]=useState('');
 const[loading,setLoading]=useState(true);
 const[signing,setSigning]=useState(false);
 const[error,setError]=useState('');
 const[authorized,setAuthorized]=useState(false);
 useEffect(()=>{let active=true;(async()=>{const{data}=await supabase.auth.getSession();if(active)setAuthorized(!!data.session);setLoading(false)})();const{data:sub}=supabase.auth.onAuthStateChange((_event,session)=>{if(active)setAuthorized(!!session)});return()=>{active=false;sub.subscription.unsubscribe()}},[]);
 const login=async e=>{e.preventDefault();setError('');setSigning(true);const{error}=await supabase.auth.signInWithPassword({email:email.trim(),password});if(error)setError('E-mail ou senha inválidos.');setSigning(false)};
 const logout=async()=>{await supabase.auth.signOut();onExit()};
 if(loading)return <div className="admin-login-screen"><div className="admin-login-card"><div className="app-loading-brand">VESTES<span>!</span></div><p>Verificando acesso…</p></div></div>;
 if(authorized)return <Admin onExit={logout}/>;
 return <div className="admin-login-screen"><div className="admin-login-card"><div className="admin-login-icon"><ShieldCheck size={25}/></div><div className="app-loading-brand">VESTES<span>!</span></div><h1>Acesso administrativo</h1><p>Entre com o e-mail e a senha cadastrados no Supabase.</p><form onSubmit={login}><label>E-mail / Gmail<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="seuemail@gmail.com" autoComplete="username"/></label><label>Senha<input required type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Sua senha" autoComplete="current-password"/></label>{error&&<div className="admin-login-error">{error}</div>}<button type="submit" className="admin-login-submit" disabled={signing}>{signing?'Entrando…':'Entrar no painel'}</button><button type="button" className="admin-login-back" onClick={onExit}>Voltar para a loja</button></form></div></div>;
}