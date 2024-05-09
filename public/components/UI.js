const SignInForm = (function () {
	// This function initializes the UI
	const initialize = function () {
		// Hide it
		// $('#signin-overlay').hide()

		// Submit event for the signin form
		$('#signin-form').on('submit', (e) => {
			// Do not submit the form
			e.preventDefault()

			// Get the input fields
			const username = $('#signin-username').val().trim()
			const password = $('#signin-password').val().trim()

			// Send a signin request
			Authentication.signin(
				username,
				password,
				() => {
					hide()
					UserPanel.update(Authentication.getUser())
					UserPanel.show()

					Socket.connect()
				},
				(error) => {
					$('#signin-message').text(error)
				},
			)
		})

		// Submit event for the register form
		$('#register-form').on('submit', (e) => {
			// Do not submit the form
			e.preventDefault()

			// Get the input fields
			const username = $('#register-username').val().trim()
			const name = $('#register-name').val().trim()
			const password = $('#register-password').val().trim()
			const confirmPassword = $('#register-confirm').val().trim()

			// Password and confirmation does not match
			if (password != confirmPassword) {
				$('#register-message').text('Passwords do not match.')
				return
			}

			// Send a register request
			Registration.register(
				username,
				name,
				password,
				() => {
					$('#register-form').get(0).reset()
					$('#register-message').text('You can sign in now.')
				},
				(error) => {
					$('#register-message').text(error)
				},
			)
		})
	}

	// This function shows the form
	const show = function () {
		$('#signin-form').fadeIn(0)
	}

	// This function hides the form
	const hide = function () {
		$('#signin-form').fadeOut(0)
		$('#signin-message').text('')
		$('#register-message').text('')
		// $('#signin-overlay').fadeOut(500)
	}

	return { initialize, show, hide }
})()

const PlayerSelectionPanel = (function () {
	const initialize = function () {
		$('#join-player1-btn').click(joinPlayer1)
		$('#join-player2-btn').click(joinPlayer2)
		$('#player-selection-container').hide()
	}

	const show = function () {
		$('#player-selection-container').show()
	}

	const hide = function () {
		$('#player-selection-container').hide()
	}

	const joinPlayer1 = function () {
		Socket.joinPlayer(1)
	}

	const joinPlayer2 = function () {
		Socket.joinPlayer(2)
	}

	const updatePlayerStatus = function (status) {
		const player1Name = $('#player1-name')
		const player2Name = $('#player2-name')

		player1Name.text(status.player1.name)
		player2Name.text(status.player2.name)
	}

	return { initialize, show, hide, joinPlayer1, joinPlayer2, updatePlayerStatus }
})()

const UserPanel = (function () {
	// This function initializes the UI
	const initialize = function () {
		// Hide it
		$('#sign-out-container').hide()

		// Click event for the signout button
		$('#signout-btn').on('click', () => {
			// Send a signout request
			Authentication.signout(() => {
				Socket.disconnect()

				hide()
				SignInForm.show()
			})
		})
	}

	// This function shows the form with the user
	const show = function (user) {
		$('#sign-out-container').show()
	}

	// This function hides the form
	const hide = function () {
		$('#sign-out-container').hide()
	}

	// This function updates the user panel
	const update = function (user) {
		if (user) {
			$('#sign-out-container #signed-in-username').text(user.name)
		} else {
			$('#sign-out-container #signed-in-username').text('')
		}
	}

	return { initialize, show, hide, update }
})()

const OnlineUsersPanel = (function () {
	// This function initializes the UI
	const initialize = function () {
		const onlineUsersArea = $('#online-user-panel')

		// Clear the online users area
		onlineUsersArea.hide()}

	const showPanel = function () {
		const onlineUsersArea = $('#online-user-panel')

		// Clear the online users area
		onlineUsersArea.show()
	}

	const hidePanel = function () {
		const onlineUsersArea = $('#online-user-panel')

		// Clear the online users area
		onlineUsersArea.hide()
	}

	// This function updates the online users panel
	const update = function (onlineUsers) {
		const onlineUsersArea = $('#online-user-list')

		// Clear the online users area
		onlineUsersArea.empty()

		// Get the current user
		const currentUser = Authentication.getUser()

		// Add the user one-by-one
		for (const username in onlineUsers) {
			if (username != currentUser.username) {
				onlineUsersArea.append(
					$("<span id='username-" + username + "'></span>").append(
						UI.getUserDisplay(onlineUsers[username]),
					)
				)
			} else {
				onlineUsersArea.append(
					$("<span id='username-" + username + "' style='color: red;'></span>").append(
						UI.getUserDisplay(onlineUsers[username]),
					)
				)
			}
		}
	}

	// This function adds a user in the panel
	const addUser = function (user) {
		const onlineUsersArea = $('#online-user-list')

		// Find the user
		const userDiv = onlineUsersArea.find('#username-' + user.username)

		// Add the user
		if (userDiv.length == 0) {
			onlineUsersArea.append(
				$("<span id='username-" + user.username + "'></span>").append(
					UI.getUserDisplay(user),
				),
			)
		}
	}

	// This function removes a user from the panel
	const removeUser = function (user) {
		const onlineUsersArea = $('#online-user-list')

		// Find the user
		const userDiv = onlineUsersArea.find('#username-' + user.username)

		// Remove the user
		if (userDiv.length > 0) userDiv.remove()
	}

	return { initialize, showPanel, hidePanel, update, addUser, removeUser }
})()

const UI = (function () {
	// This function gets the user display
	const getUserDisplay = function (user) {
		// return $("<div class='field-content row shadow'></div>")
		// 	.append($("<span class='user-name'>" + user.name + '</span>'))
		return user.name + " "
	}

	// The components of the UI are put here
	const components = [SignInForm, PlayerSelectionPanel, UserPanel, OnlineUsersPanel]

	// This function initializes the UI
	const initialize = function () {
		// Initialize the components
		for (const component of components) {
			component.initialize()
		}
	}

	const hideFrontPage = function () {
		$('#signin-overlay').hide()
	}

	const showFrontPage = function () {
		$('#signin-overlay').show()
	}

	return { getUserDisplay, initialize, hideFrontPage, showFrontPage }
})()
