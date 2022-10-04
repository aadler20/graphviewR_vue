<template>
  <div class="main">
    <a-form
      class="user-layout-login"
      :form="form"
      @submit="handleSubmit"
    >
      <a-alert v-if="state.isLoginError" type="error" showIcon style="margin-bottom: 24px;" message="Please check your login info." />
      <a-form-item>
        <a-input
          size="large"
          type="text"
          :placeholder="i18nRender('user.login.username.placeholder')"
          v-decorator="customRoles.username"
        >
          <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input>
      </a-form-item>

      <a-form-item>
        <a-input-password
          size="large"
          :placeholder="i18nRender('user.login.password')"
          v-decorator="customRoles.password"
        >
          <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input-password>
      </a-form-item>

      <a-form-item style="margin-top:24px">
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="login-button"
          :loading="state.disabled"
          :disabled="state.disabled"
        >{{ i18nRender('user.login.login') }}</a-button>
        <!--<router-link class="forgetPassword" :to="{ name: 'forgetPassword' }">{{ i18nRender('user.login.forgot-password') }}</router-link>-->
        <router-link class="register" :to="{ name: 'register' }">{{ i18nRender('user.login.signup') }}</router-link>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
// import md5 from 'md5'
import { mapActions } from 'vuex'
import { i18nRender } from '@/locales'
import { timeFix } from '@/utils/util'

export default {
  data () {
    return {
      // form
      form: this.$form.createForm(this),
      state: {
        isLoginError: false,
        disabled: false
      },
      // form rules
      customRoles: {
        username: [
          'username',
          {
            rules: [
              { required: true, message: i18nRender('user.login.message-invalid-credentials') },
              { validator: this.handleUsernameOrEmail }
            ],
            validateTrigger: 'change'
          }
        ],
        password: [
          'password',
          {
            rules: [
              { required: true, message: i18nRender('user.password.required') }
            ],
            validateTrigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    i18nRender,
    ...mapActions(['Login', 'Logout']),
    // handler
    handleUsernameOrEmail (rule, value, callback) {
      const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
      regex.test(value)
      callback()
    },
    handleSubmit (e) {
      e.preventDefault()
      const {
        form: { validateFields },
        state,
        Login
      } = this
      state.disabled = true
      validateFields({ force: true }, (err, values) => {
        if (!err) {
          const loginParams = { ...values }
          console.info('loginParams', loginParams)
          Login(loginParams)
            .then((res) => this.loginSuccess(res))
            .catch(err => this.requestFailed(err))
            .finally(() => {
              state.disabled = false
            })
        } else {
          setTimeout(() => {
            state.disabled = false
          }, 600)
        }
      })
    },
    loginSuccess (res) {
      console.log('login success', res)
      this.state.isLoginError = false
      this.$router.push({ path: '/' })
      setTimeout(() => {
        this.$notification.success({
          message: 'Welcome',
          description: `${timeFix()}! Welcome back.`
        })
      }, 1000)
    },
    requestFailed () {
      this.state.isLoginError = true
    }
  }
}
</script>

<style lang="less" scoped>
.user-layout-login {
  label {
    font-size: 14px;
  }

  .register, .forgetPassword{
    float: left;
    margin-left: 2rem;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }
}
</style>
