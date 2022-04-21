import React from 'react';

export const stopPropagation = (e: React.MouseEvent<Element, MouseEvent>) => {
  e.stopPropagation();
};

export const preventDefault = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
};
