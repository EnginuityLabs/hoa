import { useState, useEffect } from "react";
import "./App.css";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { Icon, LatLng } from "leaflet";
import { Button as AButton, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Textarea,
  Text,
  Card,
  CardHeader,
  CardBody,
  Stack,
  StackDivider,
  Heading,
  ChakraProvider,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
} from "@chakra-ui/react";

let MAP_POSITION: LatLng | null = null;

function DraggableMarker() {
  const [position, setPosition] = useState<LatLng | null>(null);

  const map = useMapEvents({
    click(e) {
      MAP_POSITION = e.latlng;
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
    dragend() {
      MAP_POSITION = map.getCenter();
      setPosition(map.getCenter());
    },
    locationfound(e) {
      MAP_POSITION = e.latlng;
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  useEffect(() => {
    map.locate({ setView: true, maxZoom: 16 });
  }, [map]);

  return (
    <Marker
      draggable
      position={position || useMap().getCenter()}
      eventHandlers={{
        dragend(e) {
          const marker = e.target;
          MAP_POSITION = marker.getLatLong();
          setPosition(marker.getLatLng());
        },
      }}
      icon={
        new Icon({
          iconUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        })
      }
    />
  );
}

let FILES: string[] = [];
let DESCRIPTION: string = "";
let CONTACT: string = "";

function App() {
  const submit = () => {
    const payload = {
      lat: MAP_POSITION?.lat,
      lng: MAP_POSITION?.lng,
      files: FILES,
      description: DESCRIPTION,
      contact: CONTACT,
    };
    var form = document.createElement("form");
    form.method = "POST";
    form.action = "/submit";
    var input = document.createElement("input");
    input.type = "hidden";
    input.name = "jsonData";
    input.value = JSON.stringify(payload);
    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
  };

  const filesChanged = (event: any) => {
    FILES = event?.fileList?.map((v: any) => v?.response?.name);
  };

  const descriptionChanged = (event: any) => {
    DESCRIPTION = event?.target?.value || "";
  };

  const contactChanged = (event: any) => {
    CONTACT = event?.target?.value || "";
  };

  return (
    <ChakraProvider>
      <Card m={2}>
        <CardHeader>
          <Heading>Power Ranch Watch</Heading>
          <Text>
            This is an <b>UNOFFICIAL</b> app for notifying the Power Ranch HOA
            of problems via email.
          </Text>
        </CardHeader>
        <CardBody>
          <Stack divider={<StackDivider />} spacing="4">
            <FormControl>
              <FormLabel>Where is the Problem?</FormLabel>
              <MapContainer
                center={[33.26923, -111.695401]}
                zoom={20}
                style={{ height: "100vh", width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <DraggableMarker />
              </MapContainer>
              <FormHelperText>
                (Required) Put the pin where the problem is
              </FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel>Show them the problem</FormLabel>
              <Upload
                action="./upload"
                listType="picture"
                onChange={filesChanged}
              >
                <AButton icon={<UploadOutlined />}>Upload</AButton>
              </Upload>
              <FormHelperText>
                (Encouraged) Take a few pictures of the problem
              </FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel>Tell them the problem</FormLabel>
              <Textarea onChange={descriptionChanged} />
              <FormHelperText>
                (Encouraged) Sometimes a picture is worth a 1000 words, but
                sometimes you need to tell them what they're supposed to be
                looking at.
              </FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel>How do they contact you?</FormLabel>
              <Input type="email" onChange={contactChanged} />
              <FormHelperText>
                (Encouraged) Email address for the HOA to follow up with you, a
                copy of the generated email will be delivered here as well for
                your records.
              </FormHelperText>
            </FormControl>
            <>
              <Button
                loadingText="Submitting"
                colorScheme="blue"
                variant="solid"
                onClick={submit}
              >
                Submit
              </Button>
              <FormControl>
                <FormHelperText>
                  By pressing Submit an email containing everything on this page
                  will be sent to the Power Ranch HOA
                </FormHelperText>
              </FormControl>
            </>
          </Stack>
        </CardBody>
      </Card>
      <Card m={2}>
        <CardHeader>
          <Heading>Privacy Policy</Heading>
        </CardHeader>
        <CardBody>
          <Text fontSize="xs">
            Hey Neighbor. I don't want your data. I try to only store necessary
            data for this app to work and use that data to send the email to the
            Power Ranch HOA.
            <br />
            This application is hosted on Cloudflare. I use Cloudflare R2 for
            storing files and Cloudflare Workers for running the app. That means
            everything you do here is shared with Cloudflare.
            <br />
            The emails are sent from Cloudflare Workers using MailChannels. That
            means everything that gets sent in the final email will be shared
            with MailChannels.
            <br />
            In order for the app to work, I need to store the photos you upload
            and make them accessible via an HTTP url so they can be embedded in
            the email I send to the HOA. I do not intentionally share the photos
            you take here with anyone other than Cloudflare (who hosts them)
            MailChannels (who sends the email) and the HOA (via email). But
            those photos are still publicly accessible. Please only upload
            photos you are comfortable being widely distributed.
            <br />
            If you accidentally upload a photo that you need to have deleted
            from this service, send me an email at neighbor@blankenship.io and
            I'll do my best to remove it. This offer to remove content should
            not be read as a legally binding agreement or anything, just an act
            of neighborly kindness.
            <br />
            When viewing this page, the map is rendered by downloading tiles
            from OpenStreetMaps. This means you are communicating with their
            servers and that traffic is subject to their TOS and Privacy Policy
            as well.
            <br />
            While I've done my best to enumerate all the vendors that this site
            relies on, and 3rd parties involved in the operation of this site,
            this shouldn't be considered exhaustive.
          </Text>
        </CardBody>
      </Card>
      <Card m={2}>
        <CardHeader>
          <Heading>Copyright</Heading>
        </CardHeader>
        <CardBody>
          <Text fontSize="xs">
            Copyright Enginuity Labs
            <br />
            Permission is hereby granted, free of charge, to any person
            obtaining a copy of this software and associated documentation files
            (the “Software”), to deal in the Software without restriction,
            including without limitation the rights to use, copy, modify, merge,
            publish, distribute, sublicense, and/or sell copies of the Software,
            and to permit persons to whom the Software is furnished to do so,
            subject to the following conditions:
            <br />
            The above copyright notice and this permission notice shall be
            included in all copies or substantial portions of the Software.
            <br />
            THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND,
            EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
            MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
            NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
            BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
            ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
            CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
            SOFTWARE.
          </Text>
        </CardBody>
      </Card>
    </ChakraProvider>
  );
}

export default App;
