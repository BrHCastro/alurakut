import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AluraCommons'
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations'
import React, { useState, useEffect } from 'react'

function ProfileSidebar(props) {
  return (
    <Box as="aside">
      <img src={`https://github.com/${props.githubUser}.png`} style={{ borderRadius: '8px' }} />
      <hr/>

      <p>
        <a className="boxLink" href={`https://github.com/${props.githubUser}`}>
          @{props.githubUser}
        </a>
      </p>

      <hr/>
      <AlurakutProfileSidebarMenuDefault/>
    </Box>
  )
}

function ProfileRelationsBox(props) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
      {props.title} ({props.items.length})
      </h2>
      <ul>
      { props.items.slice(0,6).map((item) => {
      return (
        <li key={item.id}>
          <a target="_blank" href={item.html_url}>
          <img src={item.avatar_url} />
          <span>{item.login}</span>
        </a>
        </li>
      )
      }) }
      </ul>
      <hr/>
      <a className="boxLink" href="#">Ver mais</a>
    </ProfileRelationsBoxWrapper>
  )
}

export default function Home() {
  const [communities, setCommunities] = useState([])
  const githubUser = 'brhcastro'
  const peopleFavorites = [
    'juunegreiros',
    'omariosouto',
    'peas',
    'rafaballerini',
    'marcobrunodev',
    'felipefialho',
    'guilhermesilveira'
  ]

  const [followers, setFollowers] = useState([])
  useEffect(()=>{
    fetch('https://api.github.com/users/BrHCastro/followers')
    .then((result) => {
      if(result.ok) {
        return result.json()
      }
      throw new Error(`Houve um erro na solicitação | Status: ${result.status}`)
    })
    .then((resp) => {
      setFollowers(resp)
    })
    .catch((error)=>{
      console.log(error)
    })
  }, [])

  const [following, setFollowing] = useState([])
  useEffect(()=>{
    fetch('https://api.github.com/users/BrHCastro/following')
    .then((result) => {
      if(result.ok) {
        return result.json()
      }
      throw new Error(`Houve um erro na solicitação | Status: ${result.status}`)
    })
    .then((resp) => {
      setFollowing(resp)
    })
    .catch((error)=>{
      console.log(error)
    })
  }, [])

  return (
    <>
    <AlurakutMenu githubUser={ githubUser }/>
    <MainGrid>
      <div className="profileArea" style={{ gridArea: 'profileArea' }}>
        <ProfileSidebar githubUser={githubUser}/>
      </div>
      <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
        <Box>
          <h1 className="title">
            Bem-vindo(a)
          </h1>
          <OrkutNostalgicIconSet/>
        </Box>
        <Box>
          <h2 className="subTitle">O que você deseja fazer?</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            const dataForm = new FormData(e.target)

            const title = dataForm.get('title')
            const image = dataForm.get('image')

            if (title.length === 0 || title === '' || title === ' ') {
              alert('Por favor, insira um título para a sua comunidade.')
            } else if (image.length === 0 || image === '' || image === ' ') {
              alert('Por favor, insira uma URL com a imagem para a sua comunidade.')
            } else {

              const community = {id: new Date().toISOString(), title: title, img: image}

              const communitiesUpdated = [...communities, community]
              setCommunities(communitiesUpdated)
            }
          }}>
            <div>
              <input
                type="text" 
                name="title" 
                area-label="Qual vai ser o nome da sua comunidade?" 
                placeholder="Qual vai ser o nome da sua comunidade?"
              />
            </div>
            <div>
              <input
                type="text" 
                name="image" 
                area-label="Coloque uma URL para usarmos de image." 
                placeholder="Coloque uma URL para usarmos de capa."
              />
            </div>
            <button>Criar comunidade</button>
          </form>
        </Box>
      </div>
      <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
        <ProfileRelationsBoxWrapper>
        <h2 className="smallTitle">
            Comunidade ({communities.length})
        </h2>
        <ul>
          { communities.slice(0,6).map((community) => {
            return (
              <li key={community.id}>
                <a href={`/community/${community.title}`}>
                <img src={community.img} />
                <span>{community.title}</span>
              </a>
              </li>
            )
          }) }
          </ul>
          <hr/>
          <a className="boxLink" href="#">Ver mais</a>
        </ProfileRelationsBoxWrapper>
        <ProfileRelationsBoxWrapper>
          <h2 className="smallTitle">
            Pessoas da comunidade ({peopleFavorites.length})
          </h2>
          <ul>
          { peopleFavorites.slice(0,6).map((person) => {
            return (
              <li key={person}>
                <a href={`/users/${person}`}>
                <img src={`https://github.com/${person}.png`} />
                <span>{person}</span>
              </a>
              </li>
            )
          }) }
          </ul>
          <hr/>
          <a className="boxLink" href="#">Ver mais</a>
        </ProfileRelationsBoxWrapper>
        <ProfileRelationsBox title="Seguidores" items={followers}/>
        <ProfileRelationsBox title="Seguido" items={following}/>
      </div>
    </MainGrid>
    </>
    )
}
