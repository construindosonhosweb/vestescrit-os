import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Search, Heart, ShoppingBag, Menu, X, ArrowRight, MapPin, LockKeyhole, Phone, Check } from 'lucide-react';
import './styles.css';
import Admin from './Admin';
import { getData } from './store';

const institutional = {
  brandIntro: { subtitle: 'Moda para vestir, confiança para escolher.', text: 'A VESTES! nasceu para oferecer moda, qualidade e praticidade para quem busca se vestir bem em todos os momentos.' },
  clothing: { title: 'Roupas e calçados', text: 'Opções para diferentes estilos e momentos, unindo estilo, conforto e praticidade.' },
  retail: { title: 'Venda no varejo', text: 'Encontre suas peças favoritas para uso pessoal ou para presentear.' },
  wholesale: { title: 'Venda no atacado', text: 'Atendimento para lojistas e empreendedores que procuram variedade para abastecer seus negócios.' },
  who: { title: 'Quem somos', text: 'Uma empresa de moda criada para aproximar pessoas da moda de forma simples, acessível e confiável.' },
  story: { title: 'Nossa história', text: 'Construímos a VESTES! com o propósito de atender diferentes públicos com qualidade, variedade e preço justo.' },
  mission: { title: 'Nossa missão', text: 'Oferecer roupas e calçados de qualidade, com variedade, bom atendimento e preços acessíveis.' },
  vision: { title: 'Nossa visão', text: 'Construir uma marca reconhecida pela qualidade, confiança, variedade e excelência no atendimento.' },
  values: { title: 'Nossos valores', items: ['Qualidade', 'Confiança', 'Respeito', 'Compromisso', 'Variedade'] },
  why: { title: 'Por que escolher a VESTES!?', items: ['Roupas e calçados em um só lugar', 'Atendimento para varejo e atacado', 'Variedade de produtos', 'Busca constante por qualidade', 'Atendimento próximo e personalizado', 'Compromisso com nossos clientes'] }
};

function Storefront() {
  const [data] = useState(() => { try { return getData(); } catch { return { products: [], categories: [], settings: {} }; } });
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState(0);
  const settings = data.settings || {};
  const categories = data.categories?.length ? data.categories : ['Feminino','Masculino','Calçados','Acessórios','Moda Casual','Moda Social'];
  const products = useMemo(() => (Array.isArray(data.products) ? data.products : []).filter(p => p.active !== false && String(p.name || '').toLowerCase().includes(search.toLowerCase())), [data.products, search]);
  const whatsapp = `https://wa.me/55${String(settings.phone || '').replace(/\\D/g, '')}`;

  return <div>
    <div className="top">RIO BRANCO • ACRE &nbsp; | &nbsp; Moda para todos os momentos</div>
    <header>
      <a className="logo" href="#inicio">{settings.storeName || 'VESTES'}<span>!</span></a>
      <nav className={menu ? 'show' : ''}>
        <a href="#inicio">Início</a><a href="#produtos">Produtos</a><a href="#categorias">Categorias</a><a href="#novidades">Novidades</a><a href="#atacado">Atacado</a><a href="#sobre">Sobre</a><a href="#contato">Contato</a>
      </nav>
      <div className="actions">
        <div className="search"><Search size={18}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar produtos"/></div>
        <Heart size={19}/>
        <button className="cart" onClick={() => setCart(v => v + 1)}><ShoppingBag size={20}/><b>{cart}</b></button>
        <a href="#admin" title="Administrador"><LockKeyhole size={17}/></a>
        <button className="hamb" onClick={() => setMenu(v => !v)}>{menu ? <X/> : <Menu/>}</button>
      </div>
    </header>

    <main>
      <section id="inicio" className="hero">
        <div><small>VESTES! • RIO BRANCO — ACRE</small><h1>{settings.heroTitle || 'Seu estilo começa aqui.'}</h1><p>{settings.heroText || 'Descubra roupas, calçados e acessórios para transformar seu estilo em cada ocasião.'}</p><div className="buttons"><a href="#produtos" className="primary">Comprar agora <ArrowRight size={18}/></a><a href="#novidades" className="secondary">Conhecer novidades</a></div></div>
        <div className="hero-card"><img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85" alt="Moda"/><span>ESTILO<br/>EM MOVIMENTO</span></div>
      </section>
      <section className="brand-story"><div><small>A VESTES!</small><h2>{institutional.brandIntro.subtitle}</h2><p>{institutional.brandIntro.text}</p></div><div className="story-sign">VESTES<span>!</span></div></section>
      <section id="categorias" className="categories"><div className="section-title"><small>EXPLORE</small><h2>Encontre seu <i>estilo.</i></h2></div><div className="cat-grid">{categories.slice(0,6).map(c => <a className="cat" href="#produtos" key={c}><div className="cat-fallback">{c}</div><strong>{c}</strong><ArrowRight size={18}/></a>)}</div></section>
      <section id="produtos" className="products"><div className="section-title row"><div><small>CURADORIA VESTES</small><h2>Peças que <i>inspiram.</i></h2></div></div><div className="product-grid">{products.map(p => { const price = Number(p.price || 0); const sale = p.salePrice != null ? Number(p.salePrice) : null; const finalPrice = sale != null ? sale : price; return <article className="product" key={p.id}><div className="photo"><img src={p.image} alt={p.name} onError={e => { e.currentTarget.style.display='none'; }}/>{sale != null && sale < price && <span>OFERTA</span>}<button><Heart size={18}/></button></div><small>{p.category}</small><h3>{p.name}</h3><div><del>{sale != null && sale < price ? `R$ ${price.toFixed(2).replace('.', ',')}` : ''}</del><strong>R$ {finalPrice.toFixed(2).replace('.', ',')}</strong></div><button className="buy" onClick={() => setCart(v => v + 1)}>Adicionar ao carrinho</button></article>; })}</div>{!products.length && <p>Nenhum produto encontrado.</p>}</section>
      <section id="novidades" className="editorial"><div><small>ROUPAS E CALÇADOS</small><h2>{institutional.clothing.title}</h2><p>{institutional.clothing.text}</p></div><div className="editorial-card">ESTILO<br/><i>CONFORTO</i><br/>PRATICIDADE</div></section>
      <section className="business-grid"><article><small>VAREJO</small><h2>{institutional.retail.title}</h2><p>{institutional.retail.text}</p></article><article id="atacado"><small>ATACADO</small><h2>{institutional.wholesale.title}</h2><p>{institutional.wholesale.text}</p><a className="primary" href={whatsapp}>Falar com o Atacado <ArrowRight size={18}/></a></article></section>
      <section id="sobre" className="about-full"><div className="about-intro"><small>{institutional.who.title.toUpperCase()}</small><h2>Moda para vestir,<br/><i>confiança para escolher.</i></h2><p>{institutional.who.text}</p></div><div className="about-story"><small>{institutional.story.title.toUpperCase()}</small><h3>{institutional.story.title}</h3><p>{institutional.story.text}</p></div></section>
      <section className="mission-grid"><article><small>MISSÃO</small><h3>{institutional.mission.title}</h3><p>{institutional.mission.text}</p></article><article><small>VISÃO</small><h3>{institutional.vision.title}</h3><p>{institutional.vision.text}</p></article></section>
      <section className="values"><div className="section-title"><small>O QUE NOS GUIA</small><h2>{institutional.values.title}</h2></div><div className="values-grid">{institutional.values.items.map(v => <article key={v}><Check size={18}/><h3>{v}</h3><p>Faz parte do nosso compromisso com cada cliente.</p></article>)}</div></section>
      <section className="why"><small>POR QUE ESCOLHER A VESTES!?</small><h2>{institutional.why.title}</h2><div className="why-list">{institutional.why.items.map(v => <span key={v}><Check size={16}/>{v}</span>)}</div></section>
      <section className="contact-cta"><small>FALE COM A VESTES!</small><h2>Estamos em Rio Branco, Acre.</h2><p>Entre em contato para conhecer nossos produtos, comprar no varejo ou falar sobre atacado.</p><a className="primary" href={whatsapp}>Falar com a Vestes! <ArrowRight size={18}/></a><strong>VESTES! — Vista seu estilo. Viva sua história.</strong></section>
    </main>
    <footer id="contato"><div className="footer-brand"><b>{settings.storeName || 'VESTES'}<span>!</span></b><p>Vista seu estilo. Viva sua história.</p></div><div><h4>Atendimento</h4><p><MapPin size={15}/> {settings.city || 'Rio Branco'} - {settings.state || 'AC'}</p><p><Phone size={15}/> {settings.phone || 'Cadastre no painel'}</p></div><div><h4>Localização</h4><p>Rio Branco – Acre, Brasil</p></div><div><h4>Explore</h4><p>Produtos</p><p>Atacado</p><p>Sobre nós</p></div></footer>
  </div>;
}

function App(){
  const [admin, setAdmin] = useState(() => window.location.hash === '#admin');
  useEffect(() => { const onHash = () => setAdmin(window.location.hash === '#admin'); window.addEventListener('hashchange', onHash); return () => window.removeEventListener('hashchange', onHash); }, []);
  if (admin) return <Admin onExit={() => { window.location.hash = ''; setAdmin(false); }} />;
  return <Storefront/>;
}

class ErrorBoundary extends React.Component { constructor(props){ super(props); this.state={error:null}; } static getDerivedStateFromError(error){ return {error}; } render(){ if(this.state.error) return <div style={{minHeight:'100vh',display:'grid',placeItems:'center',padding:24,fontFamily:'Arial',background:'#f5f1eb',color:'#171717'}}><div style={{maxWidth:620,textAlign:'center'}}><h1>VESTES!</h1><p>Ocorreu um erro ao carregar a loja.</p><button onClick={() => window.location.reload()} style={{padding:'12px 20px',background:'#171717',color:'#fff',border:0,cursor:'pointer'}}>Recarregar loja</button></div></div>; return this.props.children; } }

const root = document.getElementById('root');
if(root) createRoot(root).render(<ErrorBoundary><App/></ErrorBoundary>);
