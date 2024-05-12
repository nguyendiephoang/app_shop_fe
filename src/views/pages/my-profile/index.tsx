// ** Next
import { NextPage } from 'next'
import { useEffect, useState } from 'react'

// ** Mui
import { Button, Box, IconButton, useTheme, Grid } from '@mui/material'

// ** Component
import CustomTextFeild from 'src/components/text-field'

// ** form
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

//**config */
import { EMAIL_REG } from 'src/configs/regex'
import Avatar from '@mui/material/Avatar'
import { useDispatch, useSelector } from 'react-redux'
import { updateAuthMeAsync } from 'src/stores/apps/auth/actions'
import { AppDispatch, RootState } from 'src/stores'
import toast from 'react-hot-toast'
import { resetInitialState } from 'src/stores/apps/auth'
import { useRouter } from 'next/router'

//** component */
import IconifyIcon from 'src/components/Icon'
import WrapperFileUpload from 'src/components/wapper_file_upload'

//** Service */
import { getAuthMe } from 'src/services/auth'

//** type */
import { UserDataType } from 'src/contexts/types'
import { convertBase64, separationFullName, toFullName } from 'src/utils'
import FallbackSpinner from 'src/components/fall-back'
import Spinner from 'src/components/spinner'

type TProps = {}

type TDefaultValue = {
  email: string
  address: string
  city: string
  phoneNumber: string
  role: string
  fullName: string
}

const MyProfilePage: NextPage<TProps> = () => {
  const [loading, setLoading] = useState(false)
  const [avatar, setAvatar] = useState('')
  const [roleId, setRoleId] = useState('')

  const [user, setUser] = useState<UserDataType | null>(null)

  const router = useRouter()

  const dispatch: AppDispatch = useDispatch()
  const { isLoading, isErrorUpdateMe, isSuccessUpdateMe, messageUpdateMe } = useSelector(
    (state: RootState) => state.auth
  )

  const theme = useTheme()

  const schema = yup
    .object()
    .shape({
      email: yup.string().required('The field is required').matches(EMAIL_REG, 'The field is must email type'),
      phoneNumber: yup
        .string()
        .required('The field is required')
        .min(8, 'The min length of phone is 8 ')
        .max(10, 'The min length of phone is 10'),
      role: yup.string().required('The field is required'),
      fullName: yup.string().notRequired(),
      city: yup.string().notRequired(),
      address: yup.string().notRequired()
    })
    .required()

  const defaultValues: TDefaultValue = {
    email: '',
    address: '',
    city: '',
    phoneNumber: '',
    role: '',
    fullName: ''
  }

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const fetchGetAuthMe = async () => {
    setLoading(true)
    await getAuthMe()
      .then(async response => {
        setLoading(false)
        const data = response?.data
        console.log('data', { data, response })
        if (data) {
          setRoleId(data?.role?._id)
          setAvatar(data?.avatar)
          reset({
            email: data?.email,
            address: data?.address,
            city: data?.city,
            phoneNumber: data?.phoneNumber,
            role: data?.role?.name,
            fullName: toFullName(data?.lastName, data?.middleName, data?.firstName)
          })
        }
      })
      .catch(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchGetAuthMe()
  }, [])

  const onSubmit = (data: any) => {
    const { firstName, lastName, middleName } = separationFullName(data?.fullName)
    dispatch(
      updateAuthMeAsync({
        email: data?.email,
        firstName: firstName,
        lastName: lastName,
        middleName: middleName,
        phoneNumber: data?.phoneNumber,
        role: roleId,
        avatar,
        address: data?.address

        // city: data?.city
      })
    )
  }
  useEffect(() => {
    if (messageUpdateMe) {
      if (isErrorUpdateMe) {
        toast.error(messageUpdateMe)
      } else if (isSuccessUpdateMe) {
        toast.success(messageUpdateMe)
        fetchGetAuthMe()
      }
      dispatch(resetInitialState())
    }
  }, [isErrorUpdateMe, isSuccessUpdateMe, messageUpdateMe])

  const handleUploadAvatar = async (file: File) => {
    const base64 = await convertBase64(file)
    setAvatar(base64 as string)
  }

  return (
    <>
      {loading || (isLoading && <Spinner />)}
      <form onSubmit={handleSubmit(onSubmit)} autoComplete='off' noValidate>
        <Grid container>
          <Grid
            container
            item
            md={6}
            xs={12}
            sx={{ backgroundColor: theme.palette.background.paper, borderRadius: '15px', py: 5, px: 4 }}
          >
            <Box sx={{ height: '100%', width: '100%' }}>
              <Grid container spacing={4}>
                <Grid item md={12} xs={12}>
                  <Box
                    sx={{
                      height: '100%',
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'column',
                      gap: 2,
                      position: 'relative'
                    }}
                  >
                    <Box sx={{ position: 'relative' }}>
                      {avatar && (
                        <IconButton
                          edge='start'
                          color='inherit'
                          sx={{ position: 'absolute', bottom: -4, right: -6, zIndex: 4 }}
                          onClick={() => setAvatar('')}
                        >
                          <IconifyIcon icon='material-symbols-light:delete-sharp' />
                        </IconButton>
                      )}

                      {avatar ? (
                        <Avatar src={avatar} alt='user avatar' sx={{ width: 100, height: 100 }} />
                      ) : (
                        <Avatar sx={{ width: 100, height: 100 }}>
                          <IconifyIcon icon='ph:user-light' fontSize={70} />
                        </Avatar>
                      )}
                    </Box>
                    <WrapperFileUpload
                      uploadFunc={handleUploadAvatar}
                      objectAcceptFile={{
                        'image/jpeg': ['.jpg', '.jpeg'],
                        'image/png': ['png']
                      }}
                    >
                      <Button
                        type='submit'
                        variant='outlined'
                        sx={{ width: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <IconifyIcon icon='material-symbols:upload'></IconifyIcon>
                        {avatar ? 'Change' : 'Upload'}
                      </Button>
                    </WrapperFileUpload>
                  </Box>
                </Grid>

                <Grid item md={6} xs={12} spacing={6}>
                  <Controller
                    control={control}
                    rules={{
                      required: true
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <CustomTextFeild
                        required
                        fullWidth
                        label='Email '
                        onChange={onChange}
                        disabled
                        onBlur={onBlur}
                        value={value}
                        placeholder='Enter Email'
                        error={Boolean(errors?.email)}
                        helperText={errors?.email?.message}
                      />
                    )}
                    name='email'
                  />
                </Grid>
                <Grid item md={6} xs={12} spacing={6}>
                  <Controller
                    control={control}
                    rules={{
                      required: true
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <CustomTextFeild
                        required
                        fullWidth
                        label='Role'
                        onChange={onChange}
                        onBlur={onBlur}
                        value={value}
                        disabled
                        error={Boolean(errors?.role)}
                        helperText={errors?.role?.message}
                      />
                    )}
                    name='role'
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>

          <Grid container item md={6} xs={12} mt={{ md: 0, xs: 5 }}>
            <Box
              sx={{
                height: '100%',
                width: '100%',
                backgroundColor: theme.palette.background.paper,
                borderRadius: '15px',
                py: 5,
                px: 4
              }}
              marginLeft={{ md: 5, xs: 0 }}
            >
              <Grid container spacing={4}>
                <Grid item md={6} xs={12}>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <CustomTextFeild
                        fullWidth
                        label='FullName '
                        onChange={onChange}
                        onBlur={onBlur}
                        value={value}
                        placeholder='Enter full name'
                        error={Boolean(errors?.fullName)}
                        helperText={errors?.fullName?.message}
                      />
                    )}
                    name='fullName'
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <CustomTextFeild
                        fullWidth
                        label='Address'
                        onChange={onChange}
                        onBlur={onBlur}
                        value={value}
                        placeholder='Enter Address'
                      />
                    )}
                    name='address'
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <CustomTextFeild
                        fullWidth
                        label='City '
                        onChange={onChange}
                        onBlur={onBlur}
                        value={value}
                        placeholder='Enter City'
                      />
                    )}
                    name='city'
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <CustomTextFeild
                        required
                        fullWidth
                        label='Phone Number '
                        onChange={e => {
                          const numValue = e.target.value.replace(/\D/g, '')
                          onChange(numValue)
                        }}
                        inputProps={{
                          inputMode: 'numeric',
                          pattern: '[0-9]*',
                          minLength: 8
                        }}
                        onBlur={onBlur}
                        value={value}
                        placeholder='Enter Phone Number'
                        error={Boolean(errors?.phoneNumber)}
                        helperText={errors?.phoneNumber?.message}
                      />
                    )}
                    name='phoneNumber'
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type='submit'
            variant='contained'
            sx={{ mt: 3, mb: 2, display: 'flex', justifyContent: 'flex-end', flexDirection: 'column' }}
          >
            Update Infor
          </Button>
        </Box>
      </form>
    </>
  )
}

export default MyProfilePage
