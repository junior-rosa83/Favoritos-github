import { GithubUser } from "./GighutUser.js"

export class favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()
   
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem ('@GitHub-favorites:')) || []
  }

  save() {
    localStorage.setItem('@GitHub-favorites:', JSON.stringify(this.entries))
  }
  
  async add(username) {
    try {
      const checkName = this.entries.find(user => user.login === username)
      if(checkName) {
        throw new Error('Usuário já cadastrado!')
      }
      const user = await GithubUser.search(username)

      if(user.login === undefined) {
        throw new Error('Usuário não encontrado!')
      }

      this.entries = [user, ...this.entries]
      this.update()
      this.save()

      } catch(error) {
        alert(error.message)
      }        
  }

  delete(user) {
    const filteredEntries = this.entries.filter(entry =>
      entry.login !== user.login)
    
    this.entries = filteredEntries
    this.update()
    this.save()
  }
}

export class viewFavorites extends favorites {
  constructor(root) {
    super(root)
    this.tbody = this.root.querySelector('table tbody')
    this.update()
    this.onadd()
  }
  
  onadd() {
    const addButton = this.root.querySelector('.search button')
    
    addButton.onclick = () => {
      const { value } = this.root.querySelector('.search input')
      this.add(value)
    }
  }

  update() {
    this.removeAllTr()


    this.entries.forEach( user  => {
      const row = this.createRow()

      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `Imagem de ${user.login}`
      row.querySelector('.user a').href = `https://github.com/${user.login}` 
      row.querySelector('.user p').textContent = user.name
      row.querySelector('.user span').textContent = user.login
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers
      
      row.querySelector('button').onclick = () => {
        const isOk = confirm('Tem certeza que deseja deletar essa linha?')

        if(isOk) {
            this.delete(user)
        }
    }
    
      this.tbody.append(row)
    })
    
  }  

  createRow() {
    const tr = document.createElement('tr')
      
    tr.innerHTML = `
      <td class="user">
        <img src="https://github.com/junior-rosa83.png" alt="">
        <a href="https://github.com/junior-rosa83">
          <p>junior</p>
          <span>junior-rosa83</span>
        </a>
      </td>
      <td class="repositories">45</td>
      <td class="followers">23</td>
      <td>
        <button>&times;</button>
      </td>
    `
    return tr
  }
  
  removeAllTr() { 
    this.tbody.querySelectorAll('tr').forEach((tr) => {
      tr.remove()
    })
  }
}
