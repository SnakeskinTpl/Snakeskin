bem_index
bem_index2
bem_index3
bem_index4

###

- template bem_index()
	< h1.b-hello
		< span.&__msg style = color: blue | class = &__bar
			You are amazing!

- template bem_index2()
	< h1.b-hello
		< h2.b-desc
			< span.&__msg class = &__bar
				You are amazing!

- template bem_index3()
	< h1.b-hello
		< h2.&__desc
			< span.&__msg class = &__bar
				You are amazing!


- template bem_index4()
	- set & b-hello
	< h1.&
		< h2.&__desc
			< span.&__msg class = &__bar
				You are amazing!

###

<h1 class="b-hello"><span style="color: blue" class="b-hello__bar b-hello__msg">You are amazing!</span></h1>

***

<h1 class="b-hello"><h2 class="b-desc"><span class="b-desc__bar b-desc__msg">You are amazing!</span></h2></h1>

***

<h1 class="b-hello"><h2 class="b-hello__desc"><span class="b-hello__bar b-hello__msg">You are amazing!</span></h2></h1>

***

<h1 class="b-hello"><h2 class="b-hello__desc"><span class="b-hello__bar b-hello__msg">You are amazing!</span></h2></h1>