import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getMeetingById, updateMeetingById } from 'apiSdk/meetings';
import { Error } from 'components/error';
import { meetingValidationSchema } from 'validationSchema/meetings';
import { MeetingInterface } from 'interfaces/meeting';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { ClientInterface } from 'interfaces/client';
import { UserInterface } from 'interfaces/user';
import { getClients } from 'apiSdk/clients';
import { getUsers } from 'apiSdk/users';

function MeetingEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<MeetingInterface>(
    () => (id ? `/meetings/${id}` : null),
    () => getMeetingById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: MeetingInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateMeetingById(id, values);
      mutate(updated);
      resetForm();
      router.push('/meetings');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<MeetingInterface>({
    initialValues: data,
    validationSchema: meetingValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Meeting
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="title" mb="4" isInvalid={!!formik.errors?.title}>
              <FormLabel>Title</FormLabel>
              <Input type="text" name="title" value={formik.values?.title} onChange={formik.handleChange} />
              {formik.errors.title && <FormErrorMessage>{formik.errors?.title}</FormErrorMessage>}
            </FormControl>
            <FormControl id="start_time" mb="4">
              <FormLabel>Start Time</FormLabel>
              <Box display="flex" maxWidth="100px" alignItems="center">
                <DatePicker
                  dateFormat={'dd/MM/yyyy'}
                  selected={formik.values?.start_time ? new Date(formik.values?.start_time) : null}
                  onChange={(value: Date) => formik.setFieldValue('start_time', value)}
                />
                <Box zIndex={2}>
                  <FiEdit3 />
                </Box>
              </Box>
            </FormControl>
            <FormControl id="end_time" mb="4">
              <FormLabel>End Time</FormLabel>
              <Box display="flex" maxWidth="100px" alignItems="center">
                <DatePicker
                  dateFormat={'dd/MM/yyyy'}
                  selected={formik.values?.end_time ? new Date(formik.values?.end_time) : null}
                  onChange={(value: Date) => formik.setFieldValue('end_time', value)}
                />
                <Box zIndex={2}>
                  <FiEdit3 />
                </Box>
              </Box>
            </FormControl>
            <FormControl
              id="is_recurring"
              display="flex"
              alignItems="center"
              mb="4"
              isInvalid={!!formik.errors?.is_recurring}
            >
              <FormLabel htmlFor="switch-is_recurring">Is Recurring</FormLabel>
              <Switch
                id="switch-is_recurring"
                name="is_recurring"
                onChange={formik.handleChange}
                value={formik.values?.is_recurring ? 1 : 0}
              />
              {formik.errors?.is_recurring && <FormErrorMessage>{formik.errors?.is_recurring}</FormErrorMessage>}
            </FormControl>
            <FormControl id="recurrence_interval" mb="4" isInvalid={!!formik.errors?.recurrence_interval}>
              <FormLabel>Recurrence Interval</FormLabel>
              <NumberInput
                name="recurrence_interval"
                value={formik.values?.recurrence_interval}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('recurrence_interval', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.recurrence_interval && (
                <FormErrorMessage>{formik.errors?.recurrence_interval}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl id="single_use_link" mb="4" isInvalid={!!formik.errors?.single_use_link}>
              <FormLabel>Single Use Link</FormLabel>
              <Input
                type="text"
                name="single_use_link"
                value={formik.values?.single_use_link}
                onChange={formik.handleChange}
              />
              {formik.errors.single_use_link && <FormErrorMessage>{formik.errors?.single_use_link}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<ClientInterface>
              formik={formik}
              name={'client_id'}
              label={'Select Client'}
              placeholder={'Select Client'}
              fetcher={getClients}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.name}
                </option>
              )}
            />
            <AsyncSelect<UserInterface>
              formik={formik}
              name={'guest_id'}
              label={'Select User'}
              placeholder={'Select User'}
              fetcher={getUsers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.email}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'meeting',
  operation: AccessOperationEnum.UPDATE,
})(MeetingEditPage);
