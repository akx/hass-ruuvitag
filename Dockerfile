ARG BUILD_FROM
FROM $BUILD_FROM as build
ENV LANG C.UTF-8
# this line is shared with the actual runtime container!
RUN apk add --no-cache nodejs libusb-dev bluez-dev linux-headers eudev-dev
RUN apk add --no-cache python3 build-base yarn git
RUN yarn global add node-gyp
COPY . /app
WORKDIR /app
RUN yarn
RUN ./node_modules/.bin/tsc

FROM $BUILD_FROM
ENV LANG C.UTF-8
RUN apk add --no-cache nodejs libusb-dev bluez-dev linux-headers eudev-dev
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/js /app
WORKDIR /app
#RUN setcap cap_net_raw+eip $(eval readlink -f `which node`)
CMD [ "node", "app.js" ]
