import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import nookies from 'nookies'
import jwt from 'jsonwebtoken'
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

export default function Home(props) {
  const [communities, setCommunities] = useState([])
  const githubUser = props.githubUser
  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState([])

  useEffect(()=>{
    //Seguidores
    fetch(`https://api.github.com/users/${githubUser}/followers`)
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

    //Seguindo
    fetch(`https://api.github.com/users/${githubUser}/following`)
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

    //Comunidades
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Authorization': '3063f82c0e27c7966fe021df36caff',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ "query": `query {
        allCommunities {
          id
          title
          imageUrl
          creatorSlug
        }
      }`})
    })
    .then((response) => response.json())
    .then((respComp) => {
      const community = respComp.data.allCommunities
      const filtered = (val) => {
        if (val.creatorSlug === githubUser) {
          return true
        } else {
          return false
        }
      }
      const communityFiltered = community.filter(filtered);
      setCommunities(communityFiltered)
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

              const community = {title: title, imageUrl: image, creatorSlug: githubUser }

              fetch('/api/communities', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(community)
              })
              .then(async (resp) => {
                const dados = await resp.json()
                const communitiesUpdated = [...communities, dados.recordCreated]
                setCommunities(communitiesUpdated)


                document.querySelector('[name=title]').value = ""
                document.querySelector('[name=image]').value = ""
              })

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
        <ProfileRelationsBox title="Seguidores" items={followers}/>
        <ProfileRelationsBox title="Seguindo" items={following}/>
        <ProfileRelationsBoxWrapper>
        <h2 className="smallTitle">
            Comunidade ({communities.length})
        </h2>
        <ul>
          { communities.slice(0,6).map((community) => {
            return (
              <li key={community.id}>
                <a href={`/community/${community.id}`}>
                <img src={community.imageUrl} />
                <span>{community.title}</span>
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

export async function getServerSideProps(context) {

  const cookies = nookies.get(context)
  const token = cookies.USER_TOKEN

  const { isAuthenticated } = await fetch('https://alurakut.vercel.app/api/auth', {
    headers: {
      Authorization: token
    }
  })
  .then((res) => res.json())

  if (!isAuthenticated) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }

  const { githubUser } = jwt.decode(token)

  return {
    props: {
      githubUser // Se o nome da chave foi igual o da variável podemos usar deste jeito.
    },
  }
}