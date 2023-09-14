import {
  ChakraProps,
  Flex,
  FormControl,
  FormLabel,
  ListItem,
  OrderedList,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { createSelector } from '@reduxjs/toolkit';
import { stateSelector } from 'app/store/store';
import { useAppSelector } from 'app/store/storeHooks';
import { defaultSelectorOptions } from 'app/store/util/defaultMemoizeOptions';
import { IAINoContentFallback } from 'common/components/IAIImageFallback';
import ScrollableContent from 'features/nodes/components/sidePanel/ScrollableContent';
import { memo } from 'react';
import { FaCircleExclamation } from 'react-icons/fa6';

const selector = createSelector(
  stateSelector,
  (state) => {
    const { isEnabled, isLoading, isError, prompts, parsingError } =
      state.dynamicPrompts;

    return {
      prompts,
      parsingError,
      isDisabled: !isEnabled,
      isError,
      isLoading,
    };
  },
  defaultSelectorOptions
);

const listItemStyles: ChakraProps['sx'] = {
  '&::marker': { color: 'base.500', _dark: { color: 'base.500' } },
};

const ParamDynamicPromptsPreview = () => {
  const { prompts, parsingError, isDisabled, isLoading, isError } =
    useAppSelector(selector);

  if (isError) {
    return (
      <Flex
        w="full"
        h="full"
        layerStyle="second"
        alignItems="center"
        justifyContent="center"
        p={8}
      >
        <IAINoContentFallback
          icon={FaCircleExclamation}
          label="Problem generating prompts"
        />
      </Flex>
    );
  }

  return (
    <FormControl isInvalid={Boolean(parsingError)} isDisabled={isDisabled}>
      <FormLabel whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
        Prompts Preview ({prompts.length}){parsingError && ` - ${parsingError}`}
      </FormLabel>
      <Flex
        h={64}
        pos="relative"
        layerStyle="third"
        borderRadius="base"
        p={2}
        pointerEvents={isDisabled ? 'none' : 'auto'}
      >
        <ScrollableContent>
          <OrderedList
            stylePosition="inside"
            ms={0}
            opacity={isDisabled ? 0.5 : 1}
          >
            {prompts.map((prompt, i) => (
              <ListItem
                fontSize="sm"
                key={`${prompt}.${i}`}
                sx={listItemStyles}
              >
                <Text as="span">{prompt}</Text>
              </ListItem>
            ))}
          </OrderedList>
        </ScrollableContent>
        {isLoading && (
          <Flex
            pos="absolute"
            w="full"
            h="full"
            top={0}
            insetInlineStart={0}
            layerStyle="second"
            opacity={0.7}
            alignItems="center"
            justifyContent="center"
          >
            <Spinner />
          </Flex>
        )}
      </Flex>
    </FormControl>
  );
};

export default memo(ParamDynamicPromptsPreview);