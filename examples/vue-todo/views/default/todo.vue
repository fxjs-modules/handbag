<template>
<todo>
  	<h3>{{ title }}</h3>

  	<ul>
		<li
			v-for="(item, idx_l1) in whatShowItems"
			:key="idx_l1"
		>
      	<label :class="{ completed: item.done }">
        	<input type="checkbox" :checked="item.done" @click="toggle(item)"> {{ item.title }}
      	</label>
    	</li>
  	</ul>

	<form action="" @submit.prevent="add">
		<input ref="input" @keyup="edit" />
		<button :disabled="!text">
			Add #{{whatShowItems.length + 1}}
		</button>

		<button
			type="button"
			:disabled="doneItems.length == 0"
			@click="removeAllDone"
			>
			X {{ doneItems.length }}
		</button>
	</form>
</todo>
</template>

<script>
export default {
	data () {
		return {
			title: 'I want to behave! @Vue',
			text: '',
			items: [
				{ title: 'Avoid excessive caffeine', done: true },
				{ title: 'Hidden item', hidden: true },
				{ title: 'Be less provocative'  },
				{ title: 'Be nice to people' }
			]
		}
	},

	computed: {
		whatShowItems: function () {
			return this.items.filter(item => !item.hidden)
		},
		doneItems: function () {
			return this.items.filter(item => item.done)
		}
	},

	methods: {
		edit (e) {
			this.text = e.target.value
		},

		add (e) {
			if (this.text) {
				this.items.push({ title: this.text })
				this.text = this.$refs.input.value = ''
			}
			e.preventDefault()
		},

		removeAllDone (e) {
			this.items = this.items.filter(function(item) {
				return !item.done
			})
		},

		toggle (item) {
			this.items = this.items.map(x => {
				if (x === item)
					x.done = !x.done

				return x
			})
		}
	}
}
</script>
