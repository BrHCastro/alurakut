import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AluraCommons'
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations'
import React, { useState } from 'react'

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

export default function Home() {
  const [communities, setCommunities] = useState([{id: 1, title: 'Eu odeio acordar cedo', img: 'https://img10.orkut.br.com/community/b62636a928d479ea6b865953c0ee1010.png'}])
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
      </div>
    </MainGrid>
    </>
    )
}
